require("dotenv").config()

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


let connection = db.dbConnect()

router.post("/", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const tableName = 'csv_demonstrator';
        try {
            // Check if file was uploaded
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            // Get the uploaded file
            const csvFile = req.files.csv;
            let uploadPath = path.join(__dirname, '..', 'uploadedfile', csvFile.name);

            csvFile.mv(uploadPath, async function (err) {
                if (err) return res.status(500).send(err);

                // Read the CSV file and generate the SQL table schema and insert statement
                let tableSchema = `USE ${process.env.MYSQL_DATABASE};\n`; // Use the 'demonstrator' database
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
                                // Generate the values for each row
                                let values = '(';
                                Object.values(row).forEach((value) => {
                                    if (!isNaN(value)) {
                                        values += `${value}, `;
                                    } else {
                                        values += `'${value}', `;
                                    }
                                });
                                values = values.slice(0, -2); // Remove the last comma and space
                                values += '),\n';
                                insertStatement += values;
                            })
                            .on('end', async () => {
                                insertStatement = insertStatement.slice(0, -5); // Remove the last comma and newline
                                insertStatement += ';';
                                await connection.query(tableSchema);
                                await connection.query(insertStatement);

                                try {
                                    const res1 = await chain.call({ input: tableSchema });
                                    console.log(res1)
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

    } catch (error) {
        return res.status(401).json({
            message: "User session expired, please login again!"
        })
    }




});

module.exports = router;