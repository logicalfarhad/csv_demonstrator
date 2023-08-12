require("dotenv").config();

const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const jwt = require("jsonwebtoken");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const uploadRouter = require("./routes/upload")
const openaiRouter = require('./routes/openai')
const db = require("./config/db");

const app = express();
const port = 4000;


// Test route
app.post("/test", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Not Authorized" });
  }
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      message: `Congrats ${user}! You can now accesss the super secret resource`,
    });
  } catch (error) {
    return res.status(401).json({ error: "Not Authorized" });
  }
});

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

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
