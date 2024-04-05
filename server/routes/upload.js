const express = require("express");
const router = express.Router();
const db = require("../config/db");
const path = require("path");
const fileUpload = require('express-fileupload');
const { MYSQL_DATABASE } = process.env;

const csvHandler = require('./utils/csvHandler');
const databaseHandler = require('./utils/databaseHandler');

require('dotenv').config();

router.use(fileUpload());

let table_list = [];
const connection = db.dbConnect();

// Handle default file upload
router.post("/defaultupload", async (req, res) => {
    const directoryPath = path.join(process.cwd(), "uploadedfile");

    try {
        const csvFiles = await csvHandler.listCSVFiles(directoryPath);
        for (const csvFile of csvFiles) {
            const tableName = csvFile.split('.')[0].toLowerCase();
            const uploadPath = path.join(directoryPath, csvFile);
            try {
                const { headers, data } = await csvHandler.readCsvFile(uploadPath);
                const { tableSchema, insertStatement } = await databaseHandler.generateSqlQueries(tableName, headers, data);
                await connection.query(tableSchema);
                await connection.query(insertStatement);
            } catch (error) {
                return res.status(500).send(`An error occurred while processing ${csvFile}.`);
            }
        }
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error reading directory:', error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Check metadata
router.post("/checkmetadata", async (req, res) => {
    try {
        await connection.query(`USE ${MYSQL_DATABASE};`);
        const [rows] = await connection.query('SHOW TABLES;');
        const result = databaseHandler.checkMetadataTableExists(rows.map(item => item.Tables_in_demonstrator));
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Get tables
router.get("/gettables", async (req, res) => {
    let tableNames = [];
    try {
        for (const schema of table_list) {
            await connection.query(`USE ${MYSQL_DATABASE};`);
            const [rows] = await connection.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = ? and table_name = ?", [MYSQL_DATABASE, schema]);
            tableNames.push(rows);
        }
        const commonColumnNames = findCommonColumns(tableNames);
        backup_table = [...table_list];
        table_list = [];
        return res.status(200).json(commonColumnNames);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle file upload
router.post("/", async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const uploadedFiles = req.files.csv;
        for (const csvFile of uploadedFiles) {
            const tableName = csvFile.name.split('.')[0].toLowerCase();
            const uploadPath = path.join(__dirname, '..', 'uploadedfile', csvFile.name);
            await csvFile.mv(uploadPath);
            const { headers, data } = await csvHandler.readCsvFile(uploadPath);
            const { tableSchema, insertStatement } = await databaseHandler.generateSqlQueries(tableName, headers, data);
            try {
                await connection.query(tableSchema);
                await connection.query(insertStatement);
            } catch (error) {
                console.error(error);
                return res.status(500).send('An error occurred while executing SQL queries.');
            }
        }
        return res.send(true);
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while uploading the CSV file.');
    }
});

module.exports = router;
