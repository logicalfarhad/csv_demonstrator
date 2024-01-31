const express = require('express');
const router = express.Router();
const { dbConnect } = require('../config/db');
const { MYSQL_DATABASE, LlAMA_API } = process.env;
const connection = dbConnect();
const fetch = require("node-fetch");
const OpenAI = require("openai")


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

const templateMe = (template, replacement) => {
    var regex = /{{(.*?)}}/g;
    return template.replace(regex, (match, capture) => {
        return replacement || "";
    });
}

const extractCode = async (inputString) => {
    const regex = /```([\s\S]+?)```/g;
    const matches = inputString.match(regex);
    
    if (matches && matches.length > 0) {
        // Extracted code is between the first pair of triple backticks
        const extractedCode = matches[matches.length-1].replace(/```/g, '').replace(/sql/g, '');
        console.log('ec', extractCode)
        return extractedCode.trim();
    } else {
        return inputString;
    }
}

let messages = []

const getResult = async (template,question) => {
    console.log(template);
    console.log(question)

    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         prompt: question,
    //         max_tokens: 1024,
    //         temperature: 0.7,
    //         top_p: 1.0,
    //         seed: 10,
    //         top_k: 50
    //     }),
    // };

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": template
              },
              {
                "role": "user",
                "content": question
              }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 1,
          });
        // const result = await response.json();
        console.log(response.choices[0].message)

        return response.choices[0].message.content;
        // let sqlQuery = extractCode(result.choices[0].text)
        // return sqlQuery.split("\n").join(" ")
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
    let template = `[INST]${history.join("\n")}\n1. Identify two types of tables: original tables and tables starting with 'metadata_'. The metadata tables provide descriptions for each column of the original tables.\n
    2. Exclude results from tables starting with 'metadata_' in the query output.\n
    3. Interpret the meaning of each column based on the provided metadata descriptions. For instance, if a column like 'xyz' in the original table corresponds to temperature in the metadata tables, select 'xyz' for temperature-related queries, not the 'temperature' column from the metadata table. \n
    4. Include only known columns from the schema definition tables in the SQL query; do not use any unknown columns.\n
    5. Remember the exact table names from original tables, ensuring consistent casing and forms. \n
    6. Don't use any metadata tables in the sql query output.\n
    7. Provide answers in valid sql along with small description.[/INST]`;
    let question = `${query}`
    // let prompt = templateMe(template, query);
    // console.log(prompt);

    let sqlQuery;
    let resultQuery;
    let sqlQueryExtract;

    try {
        sqlQuery = `SELECT COUNT(*) as tableCount FROM information_schema.tables WHERE table_schema = '${MYSQL_DATABASE}';`;
        [rows] = await connection.query(`USE ${MYSQL_DATABASE};`);
        [rows] = await connection.query(sqlQuery);

        if (rows[0].tableCount == 0) {
            return res.status(200).json({
                queryResult: false,
                query: 'Please upload a CSV file first.'
            });
        } else {
            resultQuery = await getResult(template,question);
            console.log("###################");
            console.log(resultQuery);
            sqlQueryExtract = await extractCode(resultQuery)
            console.log(sqlQueryExtract);
            [rows] = await connection.query(`USE ${MYSQL_DATABASE};`);
            [rows] = await connection.query(sqlQueryExtract);
            return res.status(200).json({
                queryResult: rows,
                query: resultQuery
            });
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({
            queryResult: false,
            query: resultQuery
        });
    }
});




router.post('/provide-desc', async (req, res) => {
    console.log(req.body)

    let template = `You are an helpful ai assistant which will provide me one short sentence description from sample array of json data which I will provide and then can use provided description my chart headings.`;
    let question = `My xAxis contains ${req.body.xAxis} , yAxis contains ${req.body.yAxis} and chart type is ${req.body.chartType}. My first 2 objects of json is ${JSON.stringify(req.body.data)}. This doesnot mean the entire json data contains these values it contains alot more data based on these keys so give me generic description`
    // let prompt = templateMe(template, query);
    // console.log(prompt);

    let sqlQuery;
    let resultQuery;

    try {
        resultQuery = await getResult(template,question);
        console.log(resultQuery);
        return res.status(200).json({
            description: resultQuery
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            queryResult: false,
        });
    }
});


module.exports = router;
