const express = require('express');
const router = express.Router();
const { dbConnect } = require('../config/db');
const { getResult } = require('../config/conversationChain');
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
const generatePrompt = async (schema, databaseName) => {
    let table_name = schema[schema.length - 1].tableName;
    if (table_name.startsWith('metadata_')) {
        let [rows] = await connection.query(`USE ${databaseName};`);
        [rows] = await connection.query(`select * from ${table_name};`);
        let metadata_descirption = await generateMetadataSchema(rows)
        return `<<SYS>>In the '${table_name}' table, ${metadata_descirption}<</SYS>>`;
    }
    return `<<SYS>>Schema definiton of '${table_name}' table: ${generateTableSchema(schema)}<</SYS>>`;
}


router.post('/', async (req, res) => {
    let history = [];
    let [rows] = await connection.query(`USE ${req.databaseName};`);
    [rows] = await connection.query("show tables;");

    // let tableList = rows.map(table => table.Tables_in_demonstrator);
    const key = `Tables_in_${req.databaseName}`
    let tableList = rows.map(table => table[key]);

    for (const name of tableList) {
        [rows] = await connection.query(`DESCRIBE ${name};`);
        rows.push({
            tableName: name
        });
        let desc = await generatePrompt(rows, req.databaseName);
        history.push(desc);
    }

    let { query, locale } = req.body;
    console.log(locale)
    let systemMessageContent = "";
    if (locale === 'de') {
        systemMessageContent = `[INST]<<SYS>>${history.join("\n")}\n
        1. Identifizieren Sie zwei Arten von Tabellen: Originaltabellen und Tabellen, die mit 'metadata_' beginnen. Die Metadatentabellen enthalten Beschreibungen für jede Spalte der Originaltabellen.\n
        2. Schließen Sie Ergebnisse von Tabellen aus, die mit 'metadata_' beginnen, in der Abfrageausgabe aus.\n
        3. Interpretieren Sie die Bedeutung jeder Spalte basierend auf den bereitgestellten Metadatenbeschreibungen. Wenn beispielsweise eine Spalte wie 'xyz' in der Originaltabelle in den Metadatentabellen der Temperatur entspricht, wählen Sie 'xyz' für temperaturbezogene Abfragen aus und nicht die 'temperature'-Spalte aus der Metadatentabelle.\n
        4. Enthalten Sie nur bekannte Spalten aus den Schema-Definitionstabellen in der SQL-Abfrage; verwenden Sie keine unbekannten Spalten.\n
        5. Merken Sie sich die genauen Tabellennamen aus den Originaltabellen und stellen Sie sicher, dass die Groß- und Kleinschreibung sowie die Formen konsistent sind.\n
        6. Verwenden Sie keine Metadatentabellen in der SQL-Abfrageausgabe.\n
        7. Geben Sie Antworten in gültigem SQL \`\`\`sql \`\`\` zusammen mit einer kurzen Beschreibung an.<</SYS>>[/INST]`;
    } else {
        systemMessageContent = `[INST]<<SYS>>${history.join("\n")}\n
        1. Identify two types of tables: original tables and tables starting with 'metadata_'. The metadata tables provide descriptions for each column of the original tables.\n
        2. Exclude results from tables starting with 'metadata_' in the query output.\n
        3. Interpret the meaning of each column based on the provided metadata descriptions. For instance, if a column like 'xyz' in the original table corresponds to temperature in the metadata tables, select 'xyz' for temperature-related queries, not the 'temperature' column from the metadata table.\n
        4. Include only known columns from the schema definition tables in the SQL query; do not use any unknown columns.\n
        5. Remember the exact table names from original tables, ensuring consistent casing and forms.\n
        6. Don't use any metadata tables in the SQL query output.\n
        7. Provide answers in valid SQL \`\`\`sql \`\`\` along with small description.<</SYS>>[/INST]`;
    }
    const systemMessage = {
        role: "system",
        content: systemMessageContent
    };

    //  let prompt = templateMe(template, query);
    //  console.log(prompt);

    const userMessage = {
        role: "user",
        content: `${query}`
    };
    const messages = [systemMessage, userMessage];

    let sqlQuery = extractCode(await getResult(messages));
    try {
        if (!sqlQuery) {
            return res.status(400).json({
                queryResult: false,
                query: 'Failed to extract SQL query.'
            });
        }

        [rows] = await connection.query(`USE ${req.databaseName};`);
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
    let locale = req.body.locale;
    console.log("I am in open ai=" + locale)
    let systemMessageContent;
    let userMessageContent;

    if (locale === 'de') {
        systemMessageContent = `[INST]<<SYS>>1. Mein x-Achse enthält ${req.body.xAxis}, 
    2. y-Achse enthält ${req.body.yAxis}, 
    3. und der Diagrammtyp ist ${req.body.chartType}. 
    4. Meine ersten 2 Objekte der JSON-Daten sind ${JSON.stringify(req.body.data)}. 
    5. Dies bedeutet nicht, dass die gesamten JSON-Daten nur diese Werte enthalten; 
       sie enthalten viele weitere Daten basierend auf diesen Schlüsseln, daher geben Sie eine kurze generische Diagrammbeschreibung (Bildunterschrift) in einer kurzen Zeile an.<</SYS>>[/INST]`;

        userMessageContent = `Du bist ein hilfreicher KI-Assistent, der mir eine Bildunterschrift für das Diagramm basierend auf den bereitgestellten JSON-Daten geben wird. 
    Bitte generieren Sie eine Bildunterschrift, die die Erkenntnisse aus dem Diagramm beschreibt.`;
    } else {
        systemMessageContent = `[INST]<<SYS>>1. My xAxis contains ${req.body.xAxis}, 
    2. yAxis contains ${req.body.yAxis}, 
    3. and chart type is ${req.body.chartType}. 
    4. My first 2 objects of JSON data are ${JSON.stringify(req.body.data)}. 
    5. This does not mean the entire JSON data contains only these values; 
       it contains a lot more data based on these keys, so provide a short generic chart description (caption) in one short line.<</SYS>>[/INST]`;

        userMessageContent = `You are a helpful AI assistant which will provide me with a caption for the chart based on the provided JSON data. 
    Please generate a caption that describes the insights from the chart.`;
    }

    const systemMessage = {
        role: "system",
        content: systemMessageContent
    };

    const userMessage = {
        role: "user",
        content: userMessageContent
    };

    const messages = [systemMessage, userMessage];
    let chartDescription;

    try {
        chartDescription = await getResult(messages);
        return res.status(200).json({
            description: chartDescription
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            queryResult: false,
            error: error.message
        });
    }
});




module.exports = router;
