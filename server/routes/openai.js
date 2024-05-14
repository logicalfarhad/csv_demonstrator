const express = require('express');
const fetch = require("node-fetch");
const router = express.Router();
const { dbConnect } = require('../config/db');
const { MYSQL_DATABASE, LlAMA_API } = process.env;
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

const getResult = async (question) => {
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json; charset=utf-8',
            'Process-Mode': 'sync',
            'Authorization': 'Basic c2FsaTpQYXNzd29yZEAx',
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            prompt: question,
            doSample: true,
            maxTokens: 1024,
            numBeams: 1,
            repPenalty: 1.2,
            temperature: 0.3,
            topK: 10,
            topP: 0.6
        })
    };

    try {
        const response = await fetch(LlAMA_API, options);
        const result = await response.json();
        console.log(result);
        return result.payload.data.text;
    } catch (error) {
        console.error('Error:', error);
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
    console.log("###################");
    console.log(sqlQuery);

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
    console.log(req.body);

    let template = `You are a helpful AI assistant which will provide me with a caption for the chart based on the provided JSON data. 
    Please generate a caption that describes the insights from the chart.`;

    let question = `My xAxis contains ${req.body.xAxis}, 
    yAxis contains ${req.body.yAxis}, 
    and chart type is ${req.body.chartType}. 
    My first 2 objects of JSON are ${JSON.stringify(req.body.data)}. 
    This does not mean the entire JSON data contains these values; 
    it contains a lot more data based on these keys so give me a short generic description, 
    please do not return any code as output.`;

    let chartDescription;

    try {
        chartDescription = await getResult(template + "\n" + question);
        console.log(chartDescription);

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
