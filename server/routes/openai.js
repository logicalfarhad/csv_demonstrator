require('dotenv').config();
const express = require("express");
const router = express.Router();
const createChain = require('../config/conversationChain');
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const chain = createChain()
const connection = db.dbConnect()

router.post('/', async (req, res) => {
    const { query } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    const token = authHeader.split(" ")[1];


    let user;
    try {
        user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            queryResult: false,
            query: "User session expired, please logout and login again!"
        })
    }

    const result = await chain.call({ input: query + "\nPlease only return the valid sql query and remember the sql table name. \n", });
    if (result.response) {
        let sqlQuery = result.response.split(':')[1].trim()
        console.log(sqlQuery);
        try {
            let [rows] = await connection.query(`USE ${process.env.MYSQL_DATABASE};`);
            [rows] = await connection.query(sqlQuery);
            res.status(200).json({
                queryResult: rows,
                query: sqlQuery
            })

        } catch (e) {
            console.log(e)
            res.status(200).json({
                queryResult: false,
                query: result.response
            })
        }
    }
})
module.exports = router;