// ============================
// PRASA Backend - FINAL WORKING
// ============================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

// ============================
// ✅ GLOBAL CORS FIX
// ============================
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.options("*", cors());

// ============================
// MIDDLEWARE
// ============================
app.use(express.json());

// ============================
// MYSQL CONNECTION
// ============================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

const safeQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

// ============================
// ROUTES
// ============================
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running (CORS Enabled)");
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    const sql = `
      SELECT id, empld, empName AS name, email, phone, department, role, joiningDate
      FROM Employees
      WHERE empld = ? AND password = ?
      LIMIT 1
    `;

    const result = await safeQuery(sql, [empld, password]);

    if (result.length === 0)
      return res.json({ success: false, message: "Invalid Employee ID or Password" });

    res.json({ success: true, employee: result[0] });
  } catch (err) {
    console.error("Login Error:", err);
    res.json({ success: false, message: "Server error during login" });
  }
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
