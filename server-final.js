/* -------------------------------------------
   🚀 PRASA BACKEND – WORKING CORS + MYSQL
-------------------------------------------- */

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // IMPORTANT 🔥 promise version
require("dotenv").config();

const app = express();

/* -------------------------------------------
   🟢 GLOBAL CORS FIX (THIS SOLVES YOUR ERROR)
-------------------------------------------- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* -------------------------------------------
   🟢 MYSQL CONNECTION (AIVEN)
-------------------------------------------- */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

/* -------------------------------------------
   TEST ROUTE
-------------------------------------------- */
app.get("/", (req, res) => {
  res.send("🔥 PRASA Backend is running with CORS + MySQL!");
});

/* -------------------------------------------
   🟢 LOGIN ROUTE (WORKS WITH DB)
-------------------------------------------- */
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    const [rows] = await db.query(
      `SELECT id, empld, empName, email, phone, department, role, joiningDate 
       FROM Employees 
       WHERE empld = ? AND password = ? LIMIT 1`,
      [empld, password]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: "Invalid Employee ID or Password" });
    }

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* -------------------------------------------
   START SERVER
-------------------------------------------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
