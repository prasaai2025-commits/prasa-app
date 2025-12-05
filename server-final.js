const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mysql = require("mysql2/promise");

const app = express();

// -------------------------------------------------------
// 🔥 FIXED CORS (Render + Cloudflare Compatible)
// -------------------------------------------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// -------------------------------------------------------
// 🔥 MYSQL (AIVEN + DBVEAR) — PROMISE VERSION
// -------------------------------------------------------
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// Helper
async function runQuery(sql, params = []) {
  const [rows] = await db.query(sql, params);
  return rows;
}

// -------------------------------------------------------
// ROOT TEST
// -------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Backend running with FULL CORS FIX ✔️");
});

// -------------------------------------------------------
// LOGIN ROUTE
// -------------------------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    const sql = `
      SELECT id, empld, empName, email, phone, department, role, joiningDate
      FROM Employees
      WHERE empld = ? AND password = ?
      LIMIT 1
    `;

    const rows = await runQuery(sql, [empld, password]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    return res.json({ success: true, employee: rows[0] });
  } catch (err) {
    console.log("Login Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// -------------------------------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log("🔥 Server running on port " + PORT)
);
