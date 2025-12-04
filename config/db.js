// config/db.js
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.DB_SSL && process.env.DB_SSL.toLowerCase() === "true"
      ? {
          // If you uploaded CA cert to backend/certs/ca.pem
          ca: fs.readFileSync(path.join(__dirname, "..", "certs", "ca.pem")),
        }
      : false,
});

module.exports = pool;
