require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const createChain = require('../config/conversationChain');
const csv = require('csv-parser');
const fs = require('fs');
const chain = createChain()
const jwt = require("jsonwebtoken");
const path = require("path")
const fileUpload = require('express-fileupload');
router.use(fileUpload())
let table_list = [];
let backup_table = [];
const { JWT_SECRET, MYSQL_DATABASE } = process.env;
let connection = db.dbConnect()
const findCommonColumns = (data) => {
    const columnCounts = {};
    const tableNames = {};

    // Count the occurrences of each column name and store their table names
    for (const array of data) {
        const tableName = array[0].TABLE_NAME; // Get the table name from the first element
        for (let i = 1; i < array.length; i++) { // Start from the second element to skip the table name
            const columnName = array[i].COLUMN_NAME;

            // Exclude 'id' column
            if (columnName !== 'id') {
                if (!columnCounts[columnName]) {
                    columnCounts[columnName] = 1;
                    tableNames[columnName] = [tableName];
                } else {
                    columnCounts[columnName]++;
                    if (!tableNames[columnName].includes(tableName)) {
                        tableNames[columnName].push(tableName);
                    }
                }
            }
        }
    }

    // Filter out column names that appear in multiple tables
    const commonColumns = Object.keys(columnCounts).filter(columnName => columnCounts[columnName] > 1);

    // Create an array of objects containing the column name and associated table names
    const commonColumnsWithTables = commonColumns.map(columnName => ({
        columnName,
        tableNames: tableNames[columnName],
    }));

    return commonColumnsWithTables;
}


const generateForeignKeySQL = (tableName, foreignKeyName, referencedTableName, referencedColumnName) => {
    return `
      ALTER TABLE ${tableName}
      ADD COLUMN ${foreignKeyName} INT;
  
      ALTER TABLE ${tableName}
      ADD CONSTRAINT FK_${foreignKeyName}_${tableName}
      FOREIGN KEY (${foreignKeyName})
      REFERENCES ${referencedTableName}(${referencedColumnName});
    `;
}
const formatValue = (value) => {
    if (typeof value === 'number') {
        return value;
    } else {
        return connection.escape(value);
    }
}

// Middleware to check authentication token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Not Authorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'User session expired, please logout and login again!'
        });
    }
};
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
        console.log(result)
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

router.post("/jointables", async (req, res) => {
    let tableNames = req.body.tables;
    if (tableNames.length == 0) {
        tableNames = [...backup_table]
    }
    backup_table.length = 0
    let shouldJoin = req.body.shouldJoin;

    try {
        if (shouldJoin && tableNames.length > 1) {
            for (let i = 0; i < tableNames.length - 1; i++) {
                const tableName = tableNames[i];
                const referencedTableName = tableNames[i + 1];
                const foreignKeyName = `${referencedTableName}ID`;

                const sql = generateForeignKeySQL(tableName, foreignKeyName, referencedTableName, 'id');
                // console.log(sql)
                await connection.query(`USE ${MYSQL_DATABASE};`);
                await connection.query(sql);
            }
        }

        const schemaPromises = tableNames.map(async (name) => {
            const query = `DESCRIBE ${name};`
            const [rows] = await connection.query(query)
            return "Schema of " + name + " table: \n" + JSON.stringify(rows) + "\n \n";
        });

        const schemaResults = await Promise.all(schemaPromises);
        const schemaString = schemaResults.join("");
        console.log(schemaString)
        const res1 = await chain.call({ input: schemaString });
        console.log(res1);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(`Error executing SQL: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.get("/gettables", authenticateToken, async (req, res) => {
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
router.post("/", authenticateToken, async (req, res) => {
    let tableName;
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }


        const csvFile = req.files.csv;
        tableName = csvFile.name.split('.')[0].toLowerCase();
        table_list.push(tableName)
        let uploadPath = path.join(__dirname, '..', 'uploadedfile', csvFile.name);

        csvFile.mv(uploadPath, async (err) => {
            if (err) return res.status(500).send(err);

            // Read the CSV file and generate the SQL table schema and insert statement
            let tableSchema = `USE ${MYSQL_DATABASE};\n`; // Use the 'demonstrator' database
            tableSchema += `DROP TABLE IF EXISTS ${tableName};\n`;
            tableSchema += `CREATE TABLE ${tableName} (\n`;

            let hasId = false;
            let idCounter = 1;
            let idFieldAdded = false;

            const columns = {};
            fs.createReadStream(uploadPath)
                .pipe(csv())
                .on('data', (row) => {
                    // Check if the CSV data contains an 'id' field
                    if ('id' in row) {
                        hasId = true;
                    } else {
                        // Add the 'id' field to each row if not present
                        row.id = idCounter++;
                    }

                    // Collect column names and data types from each row
                    Object.entries(row).forEach(([key, value]) => {
                        const columnName = key.replace(/ /g, ''); // Remove spaces from the column name
                        const dataType = isNaN(value) ? 'VARCHAR(255)' : 'INT';

                        // Track the column name and its data type
                        if (!columns[columnName]) {
                            columns[columnName] = dataType;
                        }
                    });
                })
                .on('end', async () => {
                    // Use the 'id' field as the primary key if it exists in the CSV data
                    if (!hasId && !idFieldAdded) {
                        tableSchema += '  id INT AUTO_INCREMENT PRIMARY KEY,\n';
                        idFieldAdded = true;
                    }

                    // Generate the SQL schema for each column
                    Object.entries(columns).forEach(([columnName, dataType]) => {
                        if (!hasId && columnName === 'id') {
                            return; // Skip adding 'id' field to the schema again
                        }
                        tableSchema += `  ${columnName} ${dataType},\n`;
                    });

                    tableSchema = tableSchema.slice(0, -2); // Remove the last comma and newline
                    tableSchema += '\n);';

                    // Generate the INSERT INTO statement with values
                    let insertStatement = `INSERT INTO ${tableName} (`;
                    Object.keys(columns).forEach((columnName) => {
                        if (!hasId && columnName === 'id') {
                            return; // Skip adding 'id' field to the insert statement
                        }
                        insertStatement += `${columnName}, `;
                    });
                    insertStatement = insertStatement.slice(0, -2); // Remove the last comma and space
                    insertStatement += ') VALUES\n';

                    fs.createReadStream(uploadPath)
                        .pipe(csv())
                        .on('data', (row) => {
                            if (Object.keys(row).length != 0) {
                                // Generate the values for each row
                                let values = '(';
                                Object.values(row).forEach((value) => {
                                    if (!isNaN(value)) {
                                        values += `${formatValue(value.trim())}, `;
                                    } else {
                                        values += `${formatValue(value.trim())}, `;
                                    }
                                });
                                values = values.slice(0, -2); // Remove the last comma and space
                                values += '),\n';
                                insertStatement += values;
                            }

                        })
                        .on('end', async () => {
                            insertStatement = insertStatement.slice(0, -2); // Remove the last comma and newline
                            insertStatement += ';';
                            await connection.query(tableSchema);
                            //  console.log(tableSchema);
                            //  console.log(insertStatement);
                            await connection.query(insertStatement);
                            try {
                                return res.send(true);
                            } catch (error) {
                                return res.send(error)
                            }
                        });
                });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while uploading the CSV file.');
    }
});

module.exports = router;