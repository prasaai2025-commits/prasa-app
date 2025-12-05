// ======================================================
// PRASA Backend - FINAL WORKING VERSION
// ======================================================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const mysql = require("mysql2/promise");   // <- PROMISE VERSION
const cors = require("cors");
require("dotenv").config();

const app = express();

// ========================= CORS FIX =========================
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// ========================= BODY PARSER ======================
app.use(express.json());

// ========================= DB CONNECTION ====================
let db;

async function connectDB() {
  db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
  });

  console.log("✅ Connected to Aiven MySQL Database");
}

connectDB().catch((err) => console.error("DB Error:", err));

// ========================= KEEP ALIVE ========================
setInterval(async () => {
  try {
    await db.query("SELECT 1");
  } catch (err) {
    console.log("DB KeepAlive Error:", err.message);
  }
}, 30000);

// ========================= ROOT TEST ========================
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully!");
});

// ========================= LOGIN API =========================
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    if (!empld || !password)
      return res.status(400).json({ success: false, message: "Missing credentials" });

    const [rows] = await db.query(
      `SELECT id, empld, empName, email, phone, department, role, joiningDate
       FROM Employees WHERE empld = ? AND password = ? LIMIT 1`,
      [empld, password]
    );

    if (rows.length === 0)
      return res.json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ========================= TRAVEL GET =========================
app.get("/travel-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const [rows] = await db.query(
      `SELECT * FROM TravelExpenses WHERE empld = ? ORDER BY id DESC`,
      [empld]
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// ========================= TRAVEL ADD =========================
app.post("/travel-expenses", async (req, res) => {
  try {
    const {
      empld,
      travel_date,
      purpose,
      amount,
      location_from,
      location_to,
      mode_of_travel,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO TravelExpenses 
       (empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        empld,
        travel_date,
        purpose,
        amount,
        location_from || null,
        location_to || null,
        mode_of_travel || null,
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// ========================= TICKET GET =========================
app.get("/ticket-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const [rows] = await db.query(
      `SELECT * FROM TicketExpenses WHERE empld = ? ORDER BY id DESC`,
      [empld]
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// ========================= TICKET ADD =========================
app.post("/ticket-expenses", async (req, res) => {
  try {
    const { empld, ticket_date, purpose, assigned_to, amount } = req.body;

    const [result] = await db.query(
      `INSERT INTO TicketExpenses
      (empld, ticket_date, purpose, assigned_to, amount, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())`,
      [empld, ticket_date, purpose, assigned_to, amount]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// ========================= START SERVER =======================
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on ${PORT}`);
});
