const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { dbConnect } = require('../config/db');
const createChain = require('../config/conversationChain');
const chain = createChain()
const { JWT_SECRET, MYSQL_DATABASE } = process.env;
const connection = dbConnect();
router.post('/', async (req, res) => {
    try {
        const { query } = req.body;
        const { authorization: authHeader } = req.headers;

        if (!authHeader) {
            return res.status(401).json({ error: 'Not Authorized' });
        }

        const token = authHeader.split(' ')[1];
        let user;

        try {
            user = jwt.verify(token, JWT_SECRET);
            if (user.userEmail) {
                let sqlQuery = `select * from csv_demonstrator;`;
                let [rows] = await connection.query(`USE ${MYSQL_DATABASE};`);
                [rows] = await connection.query(sqlQuery);
                if (rows.length == 0) {
                    return res.status(200).json({
                        queryResult: false,
                        query: 'Please upload a CSV file first.'
                    });
                }
            }
        } catch (error) {
            return res.status(401).json({
                queryResult: false,
                query: 'User session expired, please logout and login again!'
            });
        }

        let result = await chain.call({ input: query + '\nPlease only return the valid sql part of the answer and remember the sql table name.\n' });
        console.log(result)
        if (result.response) {
            let sqlQuery = result.response.trim();
            let [rows] = await connection.query(`USE ${MYSQL_DATABASE};`);
            [rows] = await connection.query(sqlQuery);
            res.status(200).json({
                queryResult: rows,
                query: sqlQuery
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
module.exports = router;
