require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require("mongoose");

const MONGO_URI = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}`;
//const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

exports.mongoConnect = () => {
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("Successfully connected to MongoDB");
        })
        .catch((error) => {
            console.log("MongoDB connection failed. Exiting now...");
            console.error(error);
            process.exit(1);
        });
};

exports.dbConnect = () => {

    const connection = mysql.createPool({
        connectionLimit: 100,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        multipleStatements: true,
       // port: 3307
    });




    /*
        const connection = mysql.createPool({
            connectionLimit: 100,
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'demonstrator',
            multipleStatements: true,
           // port: 3306
        });
    */

    // console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

    connection.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.');
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.');
            }
        }
        if (connection) connection.release();
        return;
    });

    return connection;
};
