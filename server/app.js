require("dotenv").config();

const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const jwt = require('jsonwebtoken');
const uploadRouter = require("./routes/upload")
const openaiRouter = require('./routes/openai')
const miscRouter = require('./routes/misc')
//const db = require("./config/db");
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();



//const port = process.env["NODE_ENV"] === "development" ? 4000 : 80;
const port = 4000;
//console.log(process.env)
if (process.env["NODE_ENV"] === "development") {
  console.log("dev mode!");
} else {
  console.log("prod mode!");
}

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Function to get Keycloak public key
const getPublicKey = async (kid) => {
  const jwksUri = `${process.env.KEYCLOAK_URL}realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`;
  const response = await fetch(jwksUri);
  const data = await response.json(); // Parse JSON response
  const key = data.keys.find((k) => k.kid === kid);

  if (key && key.x5c && key.x5c.length > 0) {
    const cert = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;
    return cert;
  }

  throw new Error("Public key not found or in an unsupported format.");
};


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not Authorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded.header.kid;
    const publicKey = await getPublicKey(kid);
    jwt.verify(token, publicKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      // Check token expiration
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Token has expired" });
      }

      //console.log(decoded)
      req.user = decoded.preferred_username;
      console.log(req.user);
      const uniqueId = decoded.sub;
      const hash = crypto.createHash('md5').update(uniqueId).digest('hex');
      req.databaseName= `db_${hash}`;
     // console.log(req.databaseName)
      next();
    });
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      error: 'User session expired, please logout and login again!'
    });
  }
};
//app.use(authenticateToken);

// API routes

app.use("/upload",authenticateToken, uploadRouter);
app.use("/openai",authenticateToken, openaiRouter);
app.use("/misc", authenticateToken, miscRouter)
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


