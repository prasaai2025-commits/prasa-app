// ======================================================
// PRASA Backend - FINAL STABLE VERSION (Render Compatible)
// ======================================================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const mysql = require("mysql2/promise");   // <<< 100% FIX: use promise version
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// ======================================================
// CORS FIX (Render Safe)
// ======================================================
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "*",
  })
);

app.options("*", (req, res) => res.sendStatus(200));

app.use(bodyParser.json());
app.use(express.json());

// ======================================================
// MYSQL CONNECTION POOL (Promise-based)
// ======================================================
let db;

async function connectDB() {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log("✅ Connected to Aiven MySQL Database");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
}

connectDB();

// ======================================================
// SAFE QUERY WRAPPER
// ======================================================
async function safeQuery(sql, params = []) {
  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } catch (err) {
    throw err;
  }
}

// ======================================================
// KEEP DATABASE ALIVE
// ======================================================
setInterval(async () => {
  try {
    await safeQuery("SELECT 1");
  } catch (err) {
    console.log("Keep-alive error:", err.message);
  }
}, 30000);

// ======================================================
// ROUTES
// ======================================================

app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully!");
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    const sql = `
      SELECT id, empld, empName, email, phone, department, role, joiningDate
      FROM Employees
      WHERE empld = ? AND password = ?
      LIMIT 1
    `;

    const rows = await safeQuery(sql, [empld, password]);

    if (rows.length === 0)
      return res.json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// GET Travel Expenses
app.get("/travel-expenses", async (req, res) => {
  try {
    let sql = "SELECT * FROM TravelExpenses ORDER BY id DESC";
    let params = [];

    if (req.query.empld) {
      sql = "SELECT * FROM TravelExpenses WHERE empld = ? ORDER BY id DESC";
      params = [req.query.empld];
    }

    const rows = await safeQuery(sql, params);
    res.json(rows);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ADD Travel Expense
app.post("/travel-expenses", async (req, res) => {
  try {
    const { empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel } = req.body;

    const sql = `
      INSERT INTO TravelExpenses
      (empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await safeQuery(sql, [
      empld, travel_date, purpose, amount,
      location_from || null, location_to || null, mode_of_travel || null
    ]);

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ======================================================
// START SERVER
// ======================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Backend running on ${PORT}`)
);
