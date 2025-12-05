// ======================================================
// PRASA Backend – FINAL STABLE VERSION
// ======================================================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const mysql = require("mysql2/promise"); // << IMPORTANT FIX
const cors = require("cors");
require("dotenv").config();

const app = express();

// ======================================================
// CORS
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
// MYSQL CONNECTION (Promise Version) — NO ERRORS
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
      connectionLimit: 5,
      queueLimit: 0,
    });

    console.log("✅ Connected to Aiven MySQL Database");
  } catch (err) {
    console.log("❌ Database Connection Error:", err.message);
  }
}

connectDB();

// ======================================================
// ROOT TEST
// ======================================================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// ======================================================
// LOGIN
// ======================================================
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    const [rows] = await db.query(
      `SELECT id, empld, empName, email, phone, department, role, joiningDate 
       FROM Employees 
       WHERE empld = ? AND password = ?
       LIMIT 1`,
      [empld, password]
    );

    if (rows.length === 0)
      return res.json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    console.log("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// TRAVEL EXPENSES
// ======================================================
app.get("/travel-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const [rows] = empld
      ? await db.query(`SELECT * FROM TravelExpenses WHERE empld=? ORDER BY id DESC`, [empld])
      : await db.query(`SELECT * FROM TravelExpenses ORDER BY id DESC`);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/travel-expenses", async (req, res) => {
  try {
    const { empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel } =
      req.body;

    const [result] = await db.query(
      `INSERT INTO TravelExpenses 
       (empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================================================
// TICKET EXPENSES
// ======================================================
app.get("/ticket-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const [rows] = empld
      ? await db.query(`SELECT * FROM TicketExpenses WHERE empld=? ORDER BY id DESC`, [empld])
      : await db.query(`SELECT * FROM TicketExpenses ORDER BY id DESC`);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================================================
// START SERVER
// ======================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on PORT ${PORT}`);
});
