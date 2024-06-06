require('dotenv').config();
const express = require('express');
const router = express.Router();
const { dbConnect } = require('../config/db');
const fetch = require('node-fetch')
const connection = dbConnect();
const historyModule = require('../config/memory');
const OpenAI = require("openai")

const { getResult } = require('../config/conversationChain');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const extractColumnInfo = (data) => {
    const columnInfo = {};

    // Loop through the array and extract information
    for (let i = 0; i < data.length; i++) {
        if (data[i].trim() === '') continue;

        const matches = data[i].match(/([^:]+):\s*(.*)/);
        if (matches) {
            const columnName = matches[1]
                .replace(/\\/g, '')
                .trim()
                .split(' ')
                .join('_')
                .toLowerCase(); // Removed backslashes
            const description = matches[2].trim();
            columnInfo[columnName] = description;
        }
    }
    return columnInfo;
};

router.post('/saveMetadata', async (req, res) => {
    try {
        const metadata = req.body;
        const table_name = `metadata_${metadata.tableName.toLowerCase()}`;

        const metadataSql = `
            USE ${req.databaseName};
            DROP TABLE IF EXISTS ${table_name};
            CREATE TABLE ${table_name} (Column_Name VARCHAR(50) NOT NULL, Description VARCHAR(200), PRIMARY KEY (Column_Name));
        `;

        const valuesSql = metadata.tableData
            .map(column => `(${connection.escape(column.Column)}, ${connection.escape(column.Desc)})`)
            .join(', ');
        const insertSql = `INSERT INTO ${table_name} (Column_Name, Description) VALUES ${valuesSql} ON DUPLICATE KEY UPDATE Description = VALUES(Description);`;

        const sql = `${metadataSql} ${insertSql}`;
        await connection.query(sql);

        const descriptionQuery = `SELECT * FROM ${req.databaseName}.${table_name};`;
        const [rows] = await connection.query(descriptionQuery);

        const descriptionString = rows
            .filter(column => column.Description.trim() !== 'undefined')
            .map(column => `the '${column.Column_Name}' column means ${column.Description}`)
            .join(', ');


        const metadata_descirption = `<<SYS>>In the ${table_name} table, ${descriptionString}<<SYS>>`
        historyModule.updateHistory(metadata_descirption)
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});
router.post("/getCoordinates", async (req, res) => {

    try {
        const { cityName } = req.body;
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
router.post('/truncate', async (req, res) => {
    try {

        await connection.query(`USE ${req.databaseName};`);
        await connection.query('SET FOREIGN_KEY_CHECKS=0');
        let sql = `SELECT CONCAT('DROP TABLE ', TABLE_NAME, ';')
            FROM INFORMATION_SCHEMA.tables
            WHERE TABLE_SCHEMA = '${req.databaseName}';`;

        let [rows] = await connection.query(sql);
        for (const item of rows) {
            for (const sql of Object.values(item)) {
                await connection.query(`use ${req.databaseName};${sql}`);
            }
        }
        await connection.query('SET FOREIGN_KEY_CHECKS=1');
        historyModule.emptyHistory()
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }

});
router.post('/getSchema', async (req, res) => {
    let schema = req.body.schema;
    let locale = req.body.locale;
    try {
        await connection.query(`USE ${req.databaseName};`);
        const columnQuery = `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = '${req.databaseName}' and table_name="${schema.toLowerCase()}"`;
        const [rows] = await connection.query(columnQuery);
        const [data] = await connection.query(`SELECT * from ${schema} LIMIT 3;`)
        const formattedStrings = data.map(obj => `(${flattenObjectValues(obj)})`).join(', ');
        const columnNames = rows.map((item) => item.COLUMN_NAME).join(",");

        /*
        const prompt = `[INST]<<SYS>>Return me one short sentence description for each of the sql column for table ${schema} e-g (${columnNames}) and having data with values ${formattedStrings}. Try to make sense of data first, type of data and then rely on column name for description.<</SYS>> \n
                        1. Please do not include sample value\n
                        2. Do not include data type\n
                        3. After column name always put colon : in the result.\n
                        4. The exact column name and every column should be present in the result.\n
                        5. Include the column names for which you could not generate any description.[/INST]`;
        */
        //  console.log(prompt)
        // Define the system and user messages
        const systemMessage = {
            role: "system",
            content: (
                "[INST]<<SYS>>Return me one short sentence description for each of the SQL columns for table " +
                `${schema} e.g. (${columnNames}) and having data with values ${formattedStrings}. ` +
                "Try to make sense of data first, type of data and then rely on column name for description.<</SYS>>\n" +
                "1. Please do not include sample value\n" +
                "2. Do not include data type\n" +
                "3. After column name always put colon : in the result.\n" +
                "4. The exact column name and every column should be present in the result.\n" +
                "5. Include the column names for which you could not generate any description.[/INST]"
            )
        };

        const userMessage = {
            role: "user",
            content: "Provide descriptions for the SQL columns."
        };



        const messages = [systemMessage, userMessage];
        let descriptions = await getResult(messages)
        descriptions = descriptions.trim().split("\n");
        console.log(descriptions)
        const columnObject = extractColumnInfo(descriptions);
        console.log(columnObject)
        rows.forEach(obj => {
            obj.description = columnObject[obj.COLUMN_NAME.toLowerCase()] || 'No description available';
        });
        return res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

const flattenObjectValues = (obj) => {
    return Object.values(obj).map(val => {
        if (typeof val === 'object' && !Array.isArray(val)) {
            return flattenObjectValues(val);
        } else {
            return val;
        }
    }).join(',');
}

module.exports = router;