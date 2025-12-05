// =============================
// PRASA FINAL BACKEND SERVER
// =============================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

// -----------------------------
// CORS FIX (FINAL)
// -----------------------------
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());

// -----------------------------
// MYSQL CONNECTION (AIVEN)
// -----------------------------
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

// -----------------------------
// TEST ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Working!");
});

// -----------------------------
// LOGIN ROUTE (100% FIXED)
// -----------------------------
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    if (!empld || !password) {
      return res.json({ success: false, message: "Missing credentials" });
    }

    const sql = `
      SELECT 
        id,
        empld,
        empName,
        email,
        phone,
        department,
        role,
        joiningDate
      FROM Employees
      WHERE empld = ? AND password = ?
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [empld, password]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const emp = rows[0];

    return res.json({
      success: true,
      employee: {
        id: emp.id,
        empld: emp.empld,
        name: emp.empName,
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        role: emp.role,
        joiningDate: emp.joiningDate
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.json({ success: false, message: "Server error: " + err.message });
  }
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
