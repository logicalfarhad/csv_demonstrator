require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const csv = require('csv-parser');
const fs = require('fs');
const path = require("path")
const fileUpload = require('express-fileupload');
const { MYSQL_DATABASE } = process.env;
const historyModule = require('../config/memory');

router.use(fileUpload())
let table_list = [];
let backup_table = [];
let connection = db.dbConnect()
const generateTableSchemaString = (schema) => {
    return `${schema.map(item => {
        if (item.Field) {
            const keyField = item.Key ? `,Key:${item.Key}` : '';
            return `Field:${item.Field},Type:${item.Type}${keyField}`;
        }

    }).join(';')}`;
}
const generatePrompt = (schema) => {
    let table_name = schema[schema.length - 1].tableName;
    return `<<SYS>>Schema definiton of ${table_name} table: ${generateTableSchemaString(schema)}<</SYS>>`;
}

const checkMetadataTableExists = (tableNames) => {
    const result = [];

    for (const tableName of tableNames) {
        // Check if the table name does not start with "metadata_"
        if (!tableName.startsWith("metadata_")) {
            const metadataTableName = `metadata_${tableName}`;

            // Check if the metadata table exists
            const metadataTableExists = tableNames.includes(metadataTableName);

            // Create an object with the table name and metadata existence status
            const tableInfo = {
                table_name: tableName,
                exists: metadataTableExists,
            };

            result.push(tableInfo);
        }
    }

    return result;
}
router.post("/checkmetadata", async (req, res) => {
    try {
        await connection.query(`USE ${MYSQL_DATABASE};`);
        let query = 'SHOW TABLES;';
        let [rows] = await connection.query(query);
        let result = checkMetadataTableExists(rows.map(item => item.Tables_in_demonstrator));
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});


router.get("/gettables", async (req, res) => {
    let tableNames = [];
    try {
        for (const schema of table_list) {
            await connection.query(`USE ${MYSQL_DATABASE};`);
            const columnQuery = "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = ? and table_name = ?";
            const [rows] = await connection.query(columnQuery, [MYSQL_DATABASE, schema]);
            tableNames.push(rows);
        }
        let commonColumnNames = findCommonColumns(tableNames);
        backup_table = [...table_list]
        table_list = [];
        return res.status(200).json(commonColumnNames);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



async function readCsvFile(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        let headers = [];

        const readStream = fs.createReadStream(filePath);

        readStream
            .pipe(csv())
            .on('headers', (headerArray) => {
                headers = headerArray;
            })
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve({ headers, data });
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

router.post("/", async (req, res) => {
    let tableName;

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const csvFile = req.files.csv;
        tableName = csvFile.name.split('.')[0].toLowerCase();
        let uploadPath = path.join(__dirname, '..', 'uploadedfile', csvFile.name);

        let tableSchema = `USE ${MYSQL_DATABASE};\n`;
        tableSchema += `DROP TABLE IF EXISTS ${tableName};\n`;
        tableSchema += `CREATE TABLE ${tableName} (\n`;

        let idFieldAdded = false;
        const { headers, data } = await readCsvFile(uploadPath);


        let modified_headers = headers.map(element => {
            if (element.includes("FK")) {
                let fk_column = element.split("_")[0] + "Id";
                return fk_column;
            }
            return element;
        });
        let insertStatement = `INSERT INTO ${tableName} (${modified_headers.join(', ')}) VALUES\n`;
        const columns = {};

        // Process headers
        const foreignKeyColumns = headers.filter(columnName => columnName.includes("FK"));

        // Process data
        for (const row of data) {
            if (Object.keys(row).length !== 0) {
                if (!idFieldAdded) {
                    tableSchema += '  id INT AUTO_INCREMENT PRIMARY KEY,\n';
                    idFieldAdded = true;
                }

                let values = '(';

                for (const [columnName, value] of Object.entries(row)) {
                    if (foreignKeyColumns.includes(columnName)) {
                        const foreignKeyValue = row[columnName];
                        const foreignTable = columnName.split("_")[0].toLowerCase();

                        // Make a SQL query to retrieve the corresponding foreign key value
                        const foreignKeyQuery = `SELECT id FROM ${foreignTable} WHERE Name='${foreignKeyValue}';`;
                        const [rows] = await connection.query(foreignKeyQuery);
                        const foreignKeyValueFromQuery = rows[0].id;

                        values += `${foreignKeyValueFromQuery}, `;
                        if (!columns[columnName]) {
                            columns[columnName] = isNaN(value) ? 'VARCHAR(255)' : 'INT';
                        }
                    } else {
                        values += `${connection.escape(value.trim())}, `;
                        if (!columns[columnName]) {
                            columns[columnName] = isNaN(value) ? 'VARCHAR(255)' : 'INT';
                        }
                    }
                }

                values = values.slice(0, -2);
                values += '),\n';
                insertStatement += values;

            }
        }

        // Remove the last comma and newline from the insert statement
        insertStatement = insertStatement.slice(0, -2);
        insertStatement += ';\n';

        tableSchema = Object.entries(columns).reduce((schema, [columnName, dataType]) => {

            if (columnName.includes("FK")) {
                let foreign_table = columnName.split("_")[0];
                schema += `  ${foreign_table}Id INT,\n`;
                schema += `  FOREIGN KEY (${foreign_table}Id) REFERENCES ${foreign_table.toLowerCase()}(id),\n`;
            } else {
                schema += `  ${columnName} ${dataType},\n`;
            }

            return schema;
        }, tableSchema);

        tableSchema = tableSchema.slice(0, -2);
        tableSchema += '\n);';

        try {
            //console.log(tableSchema);
            //console.log(insertStatement);
            // Uncomment the following lines when you are ready to execute the queries
            await connection.query(tableSchema);
            await connection.query(insertStatement);
            return res.send(true);
        } catch (error) {
            console.error(error);
            return res.status(500).send('An error occurred while executing SQL queries.');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while uploading the CSV file.');
    }
});





module.exports = router;