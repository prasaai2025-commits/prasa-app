// ======================================================
// 🔥 PRASA Backend - FINAL FIX (CORS + Login + DB + Mobile)
// ======================================================

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// ======================================================
// ✅ GLOBAL CORS FIX — SOLVES YOUR LOGIN ERROR
// ======================================================
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization, Accept",
  })
);

app.options("*", (req, res) => res.sendStatus(200));

app.use(bodyParser.json());
app.use(express.json());

// ======================================================
// ✅ AIVEN MYSQL CONNECTION (Your DB)
// ======================================================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: { rejectUnauthorized: false },

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 15000,
});

// Test DB connection
db.getConnection((err, conn) => {
  if (err) {
    console.log("❌ DB Connection Failed:", err.message);
  } else {
    console.log("✅ Connected to Aiven MySQL Database");
    conn.release();
  }
});

// Easy wrapper
function safeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Keep DB alive
setInterval(() => {
  db.query("SELECT 1").catch(() => {});
}, 30000);

// ======================================================
// ROOT TEST
// ======================================================
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully!");
});

// ======================================================
// TEST DB
// ======================================================
app.get("/test-db", async (req, res) => {
  try {
    const rows = await safeQuery("SELECT 1+1 AS result");
    res.json({ connected: true, result: rows[0].result });
  } catch (e) {
    res.json({ connected: false, error: e.message });
  }
});

// ======================================================
// ✅ LOGIN — using empld + password
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

    const result = await safeQuery(sql, [empld, password]);

    if (result.length === 0)
      return res.json({ success: false, message: "Invalid credentials" });

    const emp = result[0];

    res.json({
      success: true,
      employee: {
        id: emp.id,
        empld: emp.empld,
        name: emp.empName,
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        role: emp.role,
        joiningDate: emp.joiningDate,
      },
    });
  } catch (err) {
    console.log("Login Error:", err.message);
    res.json({ success: false, message: "Server error" });
  }
});

// ======================================================
// GET TRAVEL EXPENSES
// ======================================================
app.get("/travel-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    let sql = `
      SELECT *
      FROM TravelExpenses
      ORDER BY id DESC
    `;
    let params = [];

    if (empld) {
      sql = `
        SELECT *
        FROM TravelExpenses
        WHERE empld = ?
        ORDER BY id DESC
      `;
      params = [empld];
    }

    const result = await safeQuery(sql, params);
    res.json(result);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ======================================================
// ADD TRAVEL EXPENSE
// ======================================================
app.post("/travel-expenses", async (req, res) => {
  try {
    const { empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel } =
      req.body;

    const sql = `
      INSERT INTO TravelExpenses
      (empld, travel_date, purpose, amount, location_from, location_to, mode_of_travel, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await safeQuery(sql, [
      empld,
      travel_date,
      purpose,
      amount,
      location_from || null,
      location_to || null,
      mode_of_travel || null,
    ]);

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ======================================================
// GET TICKET EXPENSES
// ======================================================
app.get("/ticket-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    let sql = `
      SELECT *
      FROM TicketExpenses
      ORDER BY id DESC
    `;
    let params = [];

    if (empld) {
      sql = `
        SELECT *
        FROM TicketExpenses
        WHERE empld = ?
        ORDER BY id DESC
      `;
      params = [empld];
    }

    const result = await safeQuery(sql, params);
    res.json(result);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ======================================================
// ADD TICKET EXPENSE
// ======================================================
app.post("/ticket-expenses", async (req, res) => {
  try {
    const { empld, ticket_date, purpose, assigned_to, amount } = req.body;

    const sql = `
      INSERT INTO TicketExpenses
      (empld, ticket_date, purpose, assigned_to, amount, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const result = await safeQuery(sql, [
      empld,
      ticket_date,
      purpose,
      assigned_to || null,
      amount,
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on ${PORT}`);
});
