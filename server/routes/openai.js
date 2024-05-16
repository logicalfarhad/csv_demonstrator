const express = require('express');
const router = express.Router();
const { dbConnect } = require('../config/db');
const { getResult } = require('../config/conversationChain');
const { MYSQL_DATABASE } = process.env;
const connection = dbConnect();

const templateMe = (template, replacement) => {
    var regex = /{{(.*?)}}/g;
    return template.replace(regex, (match, capture) => {
        return replacement || "";
    });
}

const extractCode = (inputString) => {
    const regex = /```([\s\S]+?)```/g;
    const matches = inputString.match(regex);

    if (matches && matches.length > 0) {
        // Extracted code is between the first pair of triple backticks
        const extractedCode = matches[0].replace(/```/g, '').replace(/sql/g, '');
        return extractedCode.trim();
    } else {
        return null;
    }
}


const generateMetadataSchema = async (schema) => {
    return schema.filter(column => column.Description.trim() !== 'undefined')
        .map(column => `the '${column.Column_Name}' column means ${column.Description}`)
        .join(', ');
}

const generateTableSchema = (schema) => {
    return `${schema.map(item => {
        if (item.Field) {
            const keyField = item.Key ? `,Key:${item.Key}` : '';
            return `Field:${item.Field},Type:${item.Type}${keyField}`;
        }

    }).join(';')}`;
}
const generatePrompt = async (schema) => {
    let table_name = schema[schema.length - 1].tableName;
    if (table_name.startsWith('metadata_')) {
        let [rows] = await connection.query(`USE ${MYSQL_DATABASE};`);
        [rows] = await connection.query(`select * from ${table_name};`);
        let metadata_descirption = await generateMetadataSchema(rows)
        return `<<SYS>>In the '${table_name}' table, ${metadata_descirption}<</SYS>>`;
    }
    return `<<SYS>>Schema definiton of '${table_name}' table: ${generateTableSchema(schema)}<</SYS>>`;
}


router.post('/', async (req, res) => {
    let history = [];
    let [rows] = await connection.query(`USE ${MYSQL_DATABASE};`);
    [rows] = await connection.query("show tables;");

    let tableList = rows.map(table => table.Tables_in_demonstrator);
    for (const name of tableList) {
        [rows] = await connection.query(`DESCRIBE ${name};`);
        rows.push({
            tableName: name
        });
        let desc = await generatePrompt(rows);
        history.push(desc);
    }

    let { query } = req.body;
    let template = `[INST]${history.join("\n")}\n
1. Identify two types of tables: original tables and tables starting with 'metadata_'. The metadata tables provide descriptions for each column of the original tables.\n
2. Exclude results from tables starting with 'metadata_' in the query output.\n
3. Interpret the meaning of each column based on the provided metadata descriptions. For instance, if a column like 'xyz' in the original table corresponds to temperature in the metadata tables, select 'xyz' for temperature-related queries, not the 'temperature' column from the metadata table. \n
4. Include only known columns from the schema definition tables in the SQL query; do not use any unknown columns.\n
5. Remember the exact table names from original tables, ensuring consistent casing and forms. \n
6. Don't use any metadata tables in the sql query output.\n
7. If the question is asked in German please return the result in German as well.\n
8. Provide an SQL query code to '{{question}}'\n
[/INST]`;

    let prompt = templateMe(template, query);
    console.log(prompt);

    let sqlQuery = extractCode(await getResult(prompt));
    try {
        if (!sqlQuery) {
            return res.status(400).json({
                queryResult: false,
                query: 'Failed to extract SQL query.'
            });
        }

        [rows] = await connection.query(`USE ${MYSQL_DATABASE};`);
        [rows] = await connection.query(sqlQuery);
        return res.status(200).json({
            queryResult: rows,
            query: sqlQuery
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            queryResult: false,
            query: sqlQuery
        });
    }
});



router.post('/provide-desc', async (req, res) => {

    let template = `You are a helpful AI assistant which will provide me with a caption for the chart based on the provided JSON data. 
    Please generate a caption that describes the insights from the chart.`;

    let question = `1. My xAxis contains ${req.body.xAxis}, 
2. yAxis contains ${req.body.yAxis}, 
3. and chart type is ${req.body.chartType}. 
4. My first 2 objects of JSON data are ${JSON.stringify(req.body.data)}. 
5. This does not mean the entire JSON data contains only these values; 
   it contains a lot more data based on these keys, so provide a short generic chart description (caption) in one short line.`;

    let chartDescription;

    try {
        chartDescription = await getResult(template + "\n" + question); // Call getResult with template and question
        return res.status(200).json({
            description: chartDescription
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            queryResult: false,
            error: error.message // Providing the error message for better debugging
        });
    }
});



module.exports = router;
