const express = require('express');
const router = express.Router();
const { dbConnect } = require('../config/db');
const { getResult } = require('../config/conversationChain');
const connection = dbConnect();

const extractCode = (inputString) => {
    const regex = /```([\s\S]+?)```/g;
    const matches = inputString.match(regex);
    if (matches && matches.length > 0) {
        const extractedCode = matches[0].replace(/```/g, '').replace(/sql/g, '');
        return extractedCode.trim();
    }
    return null;
}

const generateCreateTableSchema = async (databaseName, tableName) => {
    await connection.query(`USE ${databaseName};`);
    const [rows] = await connection.query(`SHOW CREATE TABLE ${tableName};`);
    return rows[0]['Create Table'];
}

const fetchSampleRows = async (databaseName, tableName) => {
    await connection.query(`USE ${databaseName};`);
    const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 2;`);
    return rows;
}

const fetchColumnNames = async (databaseName, tableName) => {
    await connection.query(`USE ${databaseName};`);
    const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName};`);
    return columns.map(column => column.Field);
}

const generateMetadataSchema = async (databaseName, tableName) => {
    await connection.query(`USE ${databaseName};`);
    const [rows] = await connection.query(`SELECT Column_Name, Description FROM ${tableName};`);
    const formattedRows = rows.map(row => `the '${row.Column_Name}' column means ${row.Description}`).join(',\n');
    return `${tableName}:\n${formattedRows}`;
}

const generatePrompt = async (databaseName) => {
    await connection.query(`USE ${databaseName};`);
    const [tables] = await connection.query("SHOW TABLES;");


    if (tables.length == 0) {
        return ""
    }
    const key = `Tables_in_${databaseName}`;
    const tableNames = tables.map(table => table[key]);

    // Filter out tables that start with 'metadata_'
    const filteredTableNames = tableNames.filter(name => !name.startsWith('metadata_'));

    const tableSchemas = await Promise.all(filteredTableNames.map(name => generateCreateTableSchema(databaseName, name)));

    const schemaDefinitions = tableSchemas.map(schema => `CREATE TABLE:\n${schema}`).join('\n\n');

    const tableDetailsPromises = filteredTableNames.map(async name => {
        const columnNames = await fetchColumnNames(databaseName, name);
        const sampleRows = await fetchSampleRows(databaseName, name);
        const sampleRowsString = sampleRows.map(row => Object.values(row).join('\t')).join('\n');
        return `2 rows from ${name} table (columns: ${columnNames.join(', ')}):\n${sampleRowsString}`;
    });

    const tableDetails = (await Promise.all(tableDetailsPromises)).join('\n\n');

    const metadataTables = tableNames.filter(name => name.startsWith('metadata_'));

    let metadataDescriptions = '';

    if (metadataTables.length > 0) {
        const metadataDescriptionsPromises = metadataTables.map(name => generateMetadataSchema(databaseName, name));
        metadataDescriptions = (await Promise.all(metadataDescriptionsPromises)).join('\n\n');
    }

    const mysqlPrompt = `
### MySQL Query Prompt and Instructions

You are a skilled MySQL expert. Your task is to construct SQL queries that fetch specific data from the database in response to given questions. Follow these detailed instructions to ensure accurate and efficient query generation:

1. **Query Limitations**:
   - Never query for all columns from a table.
   - Use backticks (\`\`\`) around column names as delimited identifiers.

2. **Column Selection**:
   - Utilize only the column names visible in the tables provided below. Avoid querying for columns that do not exist in the schema.

${metadataDescriptions ? `
3. **Metadata Interpretation**:
   - The metadata tables provide descriptions for each column in the original tables.
   - Interpret the meaning of each column based on the provided metadata descriptions. 
   - For example, if a column 'xyz' in the original table corresponds to 'temperature' in the metadata tables, prioritize 'xyz' for temperature-related queries over the 'temperature' column in the metadata table.
` : ''}

4. **SQL Output Format**:
   - Present answers in valid SQL format (\`\`\`sql \`\`\`) accompanied by a brief description of the query's objective.

5. **Table Usage**:
   - Focus exclusively on the tables specified in the schema definitions. Exclude metadata tables from direct query outputs.

6. **DML Statements**:
   - **DO NOT** make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

### Tables Available

#### Original Tables

${schemaDefinitions}

/*
${tableDetails}
*/

${metadataDescriptions ? `#### Metadata Tables (for reference)

${metadataDescriptions}
` : ''}
`;

    return mysqlPrompt
}

router.post('/', async (req, res) => {
    let model = req.headers['x-model']? req.headers['x-model'] : 'Gpts';
    const { query, locale } = req.body;  // Extract query and locale from the request body
    try {
        // const { query, locale } = req.body;  // Extract query and locale from the request body
        const databaseName = req.databaseName

        if (!databaseName) {
            return res.status(400).json({
                queryResult: false,
                query: 'Database name is required.'
            });
        }

        // Generate the prompt based on the database schema
        const prompt = await generatePrompt(databaseName);
        if (!prompt) {
            return res.status(400).json({
                queryResult: false,
                query: 'Please upload CSV files first!'
            });
        }



        // Create system message content with the generated prompt
        const systemMessageContent = `[INST]<<SYS>>${prompt}<</SYS>>[/INST]`;

        // Create system and user messages for the AI
        const systemMessage = { role: "system", content: systemMessageContent };
        const userMessage = { role: "user", content: query };
        const messages = [systemMessage, userMessage];

        // Get the SQL query result from the AI
        const result = await getResult(messages,model);
        if (!result) {
            return res.status(400).json({
                queryResult: false,
                query: locale=='de'? 
                "Leider kann ich Ihre Frage nicht beantworten und Ihnen die angeforderten Daten nicht zur Verfügung stellen, was auf technische Probleme in unserem Dienst zurückzuführen sein könnte. Bitte wählen Sie ein anderes Modell. Sollte dieser Fehler erneut auftreten, versuchen Sie es bitte später noch einmal." 
                :
                'Unfortunately, I cannot answer your question and cannot provide you with the requested data, which may be due to technical problems in our service. Please select a different model. If this error occurs again, please try again later. '
            });
        }

        const sqlQuery = extractCode(result);
        if (!sqlQuery) {
            return res.status(400).json({
                queryResult: false,
                query: locale=='de'? 
                "Leider kann ich Ihre Frage nicht beantworten oder Ihnen die gewünschten Daten zur Verfügung stellen. Dies könnte daran liegen, dass ich Ihre Anfrage nicht richtig verstanden habe oder dass die Frage anhand der hochgeladenen Daten nicht beantwortet werden kann. Bitte formulieren Sie die Frage anders und versuchen Sie es erneut. " 
                : 
                'Unfortunately, I cannot answer your question or provide you with the requested data. This could be due to the fact that I have not understood your enquiry correctly or that the question cannot be answered from the uploaded data. Please rephrase the question and try again.'
            });
        }

        // Execute the SQL query on the database
        await connection.query(`USE ${databaseName};`);
        const [rows] = await connection.query(sqlQuery);
        // Return the query result
        if (rows.length > 0)
            return res.status(200).json({ queryResult: rows, query: sqlQuery });
        return res.status(200).json({ queryResult: false, query: locale=='de'? 
            "Leider kann ich Ihre Frage nicht beantworten oder Ihnen die gewünschten Daten zur Verfügung stellen. Dies könnte daran liegen, dass ich Ihre Anfrage nicht richtig verstanden habe oder dass die Frage anhand der hochgeladenen Daten nicht beantwortet werden kann. Bitte formulieren Sie die Frage anders und versuchen Sie es erneut. " 
            : 
            'Unfortunately, I cannot answer your question or provide you with the requested data. This could be due to the fact that I have not understood your enquiry correctly or that the question cannot be answered from the uploaded data. Please rephrase the question and try again.' });
    } catch (error) {
        console.error(error);
        const errorDescription = await errorMessage(locale,error.sqlMessage,req)
        return res.status(500).json({ queryResult: false, query: errorDescription });
    }
});



const errorMessage = async (locale, error,req) => {
    let systemMessageContent;
    let userMessageContent;
    let model = req.headers['x-model']? req.headers['x-model'] : 'Gpts';
    if (locale === 'de') {
        systemMessageContent = `${error}`;
        userMessageContent = `Sie sind ein hilfreicher KI-Assistent, der mir in nur einem Satz eine einfache Beschreibung der Sql-Fehlermeldung liefert, die ich von meiner Datenbank erhalte, wenn ich eine Abfrage ausführe.`;
    } else {
        systemMessageContent = `${error}`;
        userMessageContent = `You are a helpful AI assistant which will provide me a only one sentence simple description of the sql error message which I get from my database when I execute query.`;
    }

    const systemMessage = {
        role: "system",
        content: systemMessageContent.trim()
    };

    const userMessage = {
        role: "user",
        content: userMessageContent.trim()
    };

    const messages = [systemMessage, userMessage];
    let errorDescription;

    try {
        errorDescription = await getResult(messages,model);
        console.log(errorDescription)
        errorDescription = locale==='de' ? `Leider kann ich Ihre Frage nicht beantworten und Ihnen die gewünschten Daten nicht zur Verfügung stellen. ${errorDescription} Bitte formulieren Sie die Frage anders und versuchen Sie es erneut.` : `Unfortunately, I cannot answer your question and cannot provide you with the requested data. ${errorDescription} Please rephrase the question and try again.`
        return errorDescription.trim()
    } catch (error) {
        console.log(error);
         errorDescription = locale=='de' ? `Leider kann ich Ihre Frage nicht beantworten und Ihnen die gewünschten Daten nicht zur Verfügung stellen. Bitte formulieren Sie die Frage anders und versuchen Sie es erneut.` : `Unfortunately, I cannot answer your question and cannot provide you with the requested data. Please rephrase the question and try again.`
        return errorDescription
    }

}

router.post('/provide-desc', async (req, res) => {
    let locale = req.body.locale;
    let systemMessageContent;
    let userMessageContent;
    let model = req.headers['x-model']? req.headers['x-model'] : 'Gpts';


    if (locale === 'de') {
        systemMessageContent = `[INST]<<SYS>> 
    1. Meine x-Achse enthält ${req.body.xAxis}, 
    2. y-Achse enthält ${req.body.yAxis}, 
    3. und der Diagrammtyp ist ${req.body.chartType}. 
    4. Meine ersten 2 Objekte der JSON-Daten sind ${JSON.stringify(req.body.data)}. 
    5. Dies bedeutet nicht, dass die gesamten JSON-Daten nur diese Werte enthalten; 
       sie enthalten viele weitere Daten basierend auf diesen Schlüsseln, daher geben Sie eine kurze generische Diagrammbeschreibung (Bildunterschrift) in einer kurzen Zeile an.<</SYS>>[/INST]`;

        userMessageContent = `Du bist ein hilfreicher KI-Assistent, der mir eine Bildunterschrift für das Diagramm basierend auf den bereitgestellten JSON-Daten geben wird. Bitte generieren Sie eine Bildunterschrift, die die Erkenntnisse aus dem Diagramm beschreibt.
    
    **Beispiel-Titel**
    - "Umsatzentwicklung über Zeit: Liniendiagramm"
    - "Bevölkerungsverteilung nach Altersgruppe: Balkendiagramm"
    - "Kundenzufriedenheit nach Region: Tortendiagramm"`;
    } else {
        systemMessageContent = `[INST]<<SYS>>1. My xAxis contains ${req.body.xAxis}, 
    2. yAxis contains ${req.body.yAxis}, 
    3. and chart type is ${req.body.chartType}. 
    4. My first 2 objects of JSON data are ${JSON.stringify(req.body.data)}. 
    5. This does not mean the entire JSON data contains only these values; 
       it contains a lot more data based on these keys, so provide a short generic chart description (caption) in one short line.<</SYS>>[/INST]`;

        userMessageContent = `You are a helpful AI assistant which will provide me with a caption for the chart based on the provided JSON data. 
    Please generate a caption that describes the insights from the chart. 
**Example Titles**

"Sales Performance vs Time: Line Chart"
"Population Distribution by Age Group: Bar Chart"
"Customer Satisfaction by Region: Pie Chart"`;
    }

    const systemMessage = {
        role: "system",
        content: systemMessageContent.trim()
    };

    const userMessage = {
        role: "user",
        content: userMessageContent.trim()
    };

    const messages = [systemMessage, userMessage];
    let chartDescription;

    try {
        chartDescription = await getResult(messages,model);
        return res.status(200).json({
            description: chartDescription.trim()
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
