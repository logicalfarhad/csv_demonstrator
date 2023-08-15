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
    try {
        const metadata = req.body;
        const metadataSql = `USE ${process.env.MYSQL_DATABASE};\n` +
            'DROP TABLE IF EXISTS Metadata;\n' +
            'CREATE TABLE Metadata (Column_Name VARCHAR(50) NOT NULL, Description VARCHAR(200), PRIMARY KEY (Column_Name));\n';

        const valuesSql = metadata.map(column => {
            return `('${column.Column}', '${column.Desc}')`;
        }).join(', ');

        const insertSql = `INSERT INTO Metadata (Column_Name, Description) VALUES ${valuesSql} ON DUPLICATE KEY UPDATE Description = VALUES(Description);`;
        const sql = `${metadataSql}${insertSql}`;
        await connection.query(sql);

        const descriptionQuery = `SELECT * FROM ${process.env.MYSQL_DATABASE}.Metadata ;`;
        const [rows] = await connection.query(descriptionQuery);

        let descriptionString = "In the csv_demonstrator table, ";
        rows.forEach(column => {
            if (column.Description) {
                const columnName = column.Column_Name;
                const description = column.Description;
                descriptionString += `the '${columnName}' column represents '${description}', `;
            }
        });

        const result = await chain.call({ input: descriptionString });
        console.log(result);
        return res.status(200).json({ response: result.response });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/truncate', authenticateToken, async (req, res) => {
    try {
        const checkTableQuery = `SELECT COUNT(*) as tableExists FROM information_schema.tables WHERE table_schema = '${process.env.MYSQL_DATABASE}' AND table_name = 'csv_demonstrator';`;
        const [tableExistsResult] = await connection.query(checkTableQuery);

        if (tableExistsResult[0].tableExists === 0) {
            console.log('Table does not exist');
            return res.status(400).json({ error: 'Table does not exist' });
        }

        await connection.query(`USE ${process.env.MYSQL_DATABASE};TRUNCATE TABLE csv_demonstrator;TRUNCATE TABLE Metadata;`);
        console.log('Table truncated');
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
});


router.get('/getSchema', authenticateToken, async (req, res) => {
    try {
        const columnQuery = `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = '${process.env.MYSQL_DATABASE}' and table_name="csv_demonstrator"`;
        const [rows] = await connection.query(columnQuery);
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;