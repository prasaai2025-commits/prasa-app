// ===============================
// PRASA Backend - FINAL CORS FIX
// ===============================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

// ===============================
// ✅ GLOBAL CORS FIX (REQUIRED ON RENDER)
// ===============================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// ===============================
// ✅ AIVEN MYSQL CONNECTION
// ===============================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

// ===============================
// Helper: Query database safely
// ===============================
async function safeQuery(sql, params = []) {
  const [rows] = await db.query(sql, params);
  return rows;
}

// ===============================
// ROOT TEST
// ===============================
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully with CORS FIX!");
});

// ===============================
// LOGIN
// ===============================
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    if (!empld || !password)
      return res.json({ success: false, message: "Missing credentials" });

    const rows = await safeQuery(
      `SELECT id, empld, empName, email, phone, department, role, joiningDate
       FROM Employees
       WHERE empld = ? AND password = ?
       LIMIT 1`,
      [empld, password]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    return res.json({ success: true, employee: rows[0] });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.json({ success: false, message: "Server error" });
  }
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on ${PORT}`);
});
