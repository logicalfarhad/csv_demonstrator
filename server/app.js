require("dotenv").config();

const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const jwt = require('jsonwebtoken');
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const uploadRouter = require("./routes/upload")
const openaiRouter = require('./routes/openai')
const miscRouter = require('./routes/misc')
const db = require("./config/db");

const { dbConnect } = require('./config/db');
const historyModule = require('./config/memory');
const { MYSQL_DATABASE, LlAMA_API } = process.env;

const app = express();



//const port = process.env["NODE_ENV"] === "development" ? 4000 : 80;
const port = 4000;
//console.log(process.env)
if (process.env["NODE_ENV"] === "development") {
  console.log("dev mode!");
} else {
  console.log("prod mode!");
}
// Connect to the database
db.mongoConnect();

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
//app.use(authenticateToken);

// API routes

app.use("/upload", uploadRouter);
app.use("/openai", openaiRouter);
app.use("/misc", miscRouter)

app.get("/test", (req, res) => {
  const personList = [
    {
      firstName: "John",
      lastName: "Doe",
      age: 30,
      city: "New York"
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      age: 25,
      city: "Los Angeles"
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      age: 28,
      city: "Chicago"
    }
  ];
  return res.status(200).json(personList);
});
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
