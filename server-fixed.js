// ======================================================
// 🔥 PRASA Backend - FINAL STABLE VERSION FOR RENDER
// ======================================================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ======================================================
// ✅ GLOBAL CORS FIX
// ======================================================
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());

// ======================================================
// ✅ MYSQL POOL (Aiven)
// ======================================================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// ⭐ Promise wrapper
const promiseDB = db.promise();

// ======================================================
// KEEPALIVE — SAFE VERSION (NO ERRORS)
// ======================================================
setInterval(async () => {
  try {
    await promiseDB.query("SELECT 1");
  } catch (err) {
    console.log("KeepAlive Error:", err.message);
  }
}, 30000);

// ======================================================
// ROOT ROUTE
// ======================================================
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully on Render!");
});

// ======================================================
// LOGIN ROUTE
// ======================================================
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;
    if (!empld || !password)
      return res.json({ success: false, message: "Missing credentials" });

    const sql = `
      SELECT id, empld, empName, email, phone, department, role, joiningDate
      FROM Employees
      WHERE empld = ? AND password = ?
      LIMIT 1
    `;

    const [rows] = await promiseDB.query(sql, [empld, password]);

    if (rows.length === 0)
      return res.json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, employee: rows[0] });

  } catch (err) {
    console.log("Login Error:", err.message);
    res.json({ success: false, message: "Server error" });
  }
});

// ======================================================
// START SERVER
// ======================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on ${PORT}`);
});
