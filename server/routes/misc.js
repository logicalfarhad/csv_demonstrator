require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { dbConnect } = require('../config/db');
const createChain = require('../config/conversationChain');

const connection = dbConnect();
const chain = createChain();

// Middleware to check authentication token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Not Authorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'User session expired, please logout and login again!'
        });
    }
};

router.post('/saveMetadata', authenticateToken, async (req, res) => {
    let table_name = '';
    try {
        const metadata = req.body;
        table_name = 'Metadata_' + metadata.tableName;
        const metadataSql = `USE ${process.env.MYSQL_DATABASE};\n` +
            `DROP TABLE IF EXISTS ${table_name};\n` +
            `CREATE TABLE ${table_name} (Column_Name VARCHAR(50) NOT NULL, Description VARCHAR(200), PRIMARY KEY (Column_Name));\n`;

        const valuesSql = metadata.tableData.map(column => {
            return `('${column.Column}', '${column.Desc}')`;
        }).join(', ');

        const insertSql = `INSERT INTO ${table_name} (Column_Name, Description) VALUES ${valuesSql} ON DUPLICATE KEY UPDATE Description = VALUES(Description);`;
        const sql = `${metadataSql}${insertSql}`;
        await connection.query(sql);

        const descriptionQuery = `SELECT * FROM ${process.env.MYSQL_DATABASE}.${table_name};`;
        const [rows] = await connection.query(descriptionQuery);

        let descriptionString = "In the " + table_name + " table";
        rows.forEach(column => {
            if (column.Description) {
                const columnName = column.Column_Name;
                const description = column.Description;
                descriptionString += `the '${columnName}' column means '${description}', `;
            }
        });

        console.log(descriptionString)
        const result = await chain.call({ input: descriptionString });
        console.log(result);
        return res.status(200).json({ response: result.response });

        // return res.status(200).json({ success: true })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/truncate', authenticateToken, async (req, res) => {
    try {
        let sql = `SELECT CONCAT('DROP TABLE ', TABLE_NAME, ';')
        FROM INFORMATION_SCHEMA.tables
        WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE}';`;
        let [rows] = await connection.query(sql);
        for (const item of rows) {
            for (const sql of Object.values(item)) {
                await connection.query(`use ${process.env.MYSQL_DATABASE};${sql}`);
            }
        }
        console.log('Table truncated');
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
});


router.post('/getSchema', authenticateToken, async (req, res) => {
    let schema = req.body.schema;
    try {
        const columnQuery = `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = '${process.env.MYSQL_DATABASE}' and table_name="${schema}"`;
        const [rows] = await connection.query(columnQuery);
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;