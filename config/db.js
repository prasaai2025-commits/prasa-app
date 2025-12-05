// config/db.js
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const pool = mysql.createPool({
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.DB_SSL && process.env.DB_SSL.toLowerCase() === "true"
      ? {
          ca: fs.readFileSync(path.join(__dirname, "..", "certs", "ca.pem")),
        }
      : undefined,
});

// 🔥 Keeps Railway / Render DB awake → SUPER FAST login
setInterval(() => {
  pool.query("SELECT 1");
}, 5000);

module.exports = pool.promise();
