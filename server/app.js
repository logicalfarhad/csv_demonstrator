require("dotenv").config();

const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const uploadRouter = require("./routes/upload")
const openaiRouter = require('./routes/openai')
const miscRouter = require('./routes/misc')
const db = require("./config/db");

const app = express();
const port = 4000;

// Connect to the database
db.mongoConnect();

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// API routes
app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/openai", openaiRouter);
app.use("/api/misc", miscRouter)


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
