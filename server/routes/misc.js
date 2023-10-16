require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { dbConnect } = require('../config/db');
const createChain = require('../config/conversationChain');
const fetch = require('node-fetch')
const connection = dbConnect();
const chain = createChain();
const { OpenAI } = require("langchain/llms/openai");

console.log(process.env.MYSQL_DATABASE)
// Middleware to check authentication token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Not Authorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'User session expired, please logout and login again!'
        });
    }
};

router.post('/saveMetadata', authenticateToken, async (req, res) => {
    let table_name = '';
    try {
        const metadata = req.body;
        table_name = 'metadata_' + metadata.tableName.toLowerCase();
        const metadataSql = `USE ${process.env.MYSQL_DATABASE};\n` +
            `DROP TABLE IF EXISTS ${table_name};\n` +
            `CREATE TABLE ${table_name} (Column_Name VARCHAR(50) NOT NULL, Description VARCHAR(200), PRIMARY KEY (Column_Name));\n`;

        const valuesSql = metadata.tableData.map(column => {
            return `('${column.Column}', '${column.Desc}')`;
        }).join(', ');

        const insertSql = `INSERT INTO ${table_name} (Column_Name, Description) VALUES ${valuesSql} ON DUPLICATE KEY UPDATE Description = VALUES(Description);`;
        const sql = `${metadataSql}${insertSql}`;
        await connection.query(sql);

        const descriptionQuery = `SELECT * FROM ${process.env.MYSQL_DATABASE}.${table_name};`;
        const [rows] = await connection.query(descriptionQuery);

        let descriptionString = "In the " + table_name + " table, ";
        console.log(rows)
        rows.forEach(column => {
            if (column.Description.trim() !== 'undefined') {
                const columnName = column.Column_Name;
                const description = column.Description;
                descriptionString += `the '${columnName}' column means '${description}', `;
            }
        });

        console.log(descriptionString)
        const result = await chain.call({ input: descriptionString });
        console.log(result);
        return res.status(200).json({ response: result.response });
        // return res.status(200).json({ success: true })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

router.post("/getCoordinates", authenticateToken, async (req, res) => {

    try {
        const { cityName } = req.body;
        console.log(req.body)
        if (!cityName) {
            res.status(400).json({ error: 'City name is required in the request body' });
            return;
        }

        const dbpediaEndpoint = 'https://dbpedia.org/sparql';
        const sparqlQuery = `
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
      
            SELECT ?latitude ?longitude
            WHERE {
              ?city rdf:type dbo:City .
              ?city rdfs:label "${cityName}"@en .
              ?city geo:lat ?latitude .
              ?city geo:long ?longitude .
            }
          `;

        // Encode the SPARQL query
        const encodedQuery = encodeURIComponent(sparqlQuery);

        // Build the full URL for the SPARQL request
        const sparqlUrl = `${dbpediaEndpoint}?query=${encodedQuery}&format=json`;

        // Use node-fetch to send the SPARQL request to DBpedia
        const response = await fetch(sparqlUrl);
        const data = await response.json();

        // Check if there are results and extract latitude and longitude
        if (data.results && data.results.bindings.length > 0) {
            const cityData = data.results.bindings[0];
            const latitude = parseFloat(cityData.latitude.value);
            const longitude = parseFloat(cityData.longitude.value);

            res.json({ latitude, longitude });
        } else {
            res.status(404).json({ error: 'City not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/truncate', authenticateToken, async (req, res) => {
    console.log(process.env.MYSQL_DATABASE)
    try {

        await connection.query(`USE ${process.env.MYSQL_DATABASE};`);
        await connection.query('SET FOREIGN_KEY_CHECKS=0');
        let sql = `SELECT CONCAT('DROP TABLE ', TABLE_NAME, ';')
            FROM INFORMATION_SCHEMA.tables
            WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE}';`;

        let [rows] = await connection.query(sql);
        console.log(rows)
        for (const item of rows) {
            for (const sql of Object.values(item)) {
                await connection.query(`use ${process.env.MYSQL_DATABASE};${sql}`);
            }
        }
        await connection.query('SET FOREIGN_KEY_CHECKS=1');
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }

});


router.post('/getSchema', authenticateToken, async (req, res) => {
    let schema = req.body.schema;
    try {
        const columnQuery = `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = '${process.env.MYSQL_DATABASE}' and table_name="${schema.toLowerCase()}"`;
        const [rows] = await connection.query(columnQuery);
        // console.log(rows);

        const [data] = await connection.query(`SELECT * from ${schema} LIMIT 3;`)
        console.log(data);
        const formattedStrings = data.map(obj => `(${flattenObjectValues(obj)})`).join(', ');
        //   console.log(formattedStrings)
        const columnNames = rows.map((item) => item.COLUMN_NAME).join(",");
        // console.log(columnNames);
        const prompt = `Return me one short sentence description for each of the sql column for table ${schema} e-g (${columnNames}) and having data with values ${formattedStrings}. Try to make sense of data first, type of data and then rely on column name for description.`;

        const llm = new OpenAI({
            model: "text-davinci-003",
            temperature: 0,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        let descriptions = await llm.call(prompt);
        descriptions = descriptions.trim().split("\n");
        console.log(descriptions)

        for (let i = 0; i < rows.length - 1; i++) {
            rows[i].description = descriptions[i].split(": ")[1].replace(/[^a-zA-Z\s]/g, '');
        }

        console.log(rows);

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

/*
router.post('/getSchema', authenticateToken, async (req, res) => {
    let schema = req.body.schema;
    try {
        const columnQuery = `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = '${process.env.MYSQL_DATABASE}' and table_name="${schema}"`;
        const [rows] = await connection.query(columnQuery);
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});
*/


function flattenObjectValues(obj) {
    return Object.values(obj).map(val => {
        if (typeof val === 'object' && !Array.isArray(val)) {
            return flattenObjectValues(val);
        }
    }).join(',');
}

module.exports = router;