// ======================================================
// PRASA Backend - FINAL WORKING VERSION
// ======================================================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// -----------------------------------------
// CORS FIX (100% working for localhost + Render)
// -----------------------------------------
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.options("*", (req, res) => res.sendStatus(200));

app.use(bodyParser.json());
app.use(express.json());

// -----------------------------------------
// MYSQL CONNECTION (Aiven)
// -----------------------------------------
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// DB Promise wrapper
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// -----------------------------------------
// ROOT TEST
// -----------------------------------------
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully!");
});

// -----------------------------------------
// LOGIN FIXED (use empId instead of empld)
// -----------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    if (!empld || !password) {
      return res.json({ success: false, message: "Missing credentials" });
    }

    const sql = `
      SELECT id, empId AS empld, empName AS name, email, phone, department, role, joiningDate
      FROM Employees
      WHERE empId = ? AND password = ?
      LIMIT 1
    `;

    const rows = await query(sql, [empld, password]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    return res.json({ success: true, employee: rows[0] });
  } catch (err) {
    console.error("Login Error:", err);
    res.json({ success: false, message: err.message });
  }
});

// -----------------------------------------
// TRAVEL EXPENSES
// -----------------------------------------
app.get("/travel-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const result = await query(
      `SELECT * FROM TravelExpenses WHERE empId = ? ORDER BY id DESC`,
      [empld]
    );

    res.json(result);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post("/travel-expenses", async (req, res) => {
  try {
    const { empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel } =
      req.body;

    const sql = `
      INSERT INTO TravelExpenses
      (empId, travel_date, purpose, amount, location_from, location_to, mode_of_travel, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [
      empld,
      travel_date,
      purpose,
      amount,
      location_from,
      location_to,
      mode_of_travel,
    ]);

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// -----------------------------------------
// TICKET EXPENSES
// -----------------------------------------
app.get("/ticket-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const result = await query(
      `SELECT * FROM TicketExpenses WHERE empId = ? ORDER BY id DESC`,
      [empld]
    );

    res.json(result);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post("/ticket-expenses", async (req, res) => {
  try {
    const { empld, ticket_date, purpose, assigned_to, amount } = req.body;

    const sql = `
      INSERT INTO TicketExpenses
      (empId, ticket_date, purpose, assigned_to, amount, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [
      empld,
      ticket_date,
      purpose,
      assigned_to,
      amount,
    ]);

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// -----------------------------------------
// START SERVER
// -----------------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on PORT ${PORT}`)
);
