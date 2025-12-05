/* ========================================================
   PRASA BACKEND — FINAL STABLE VERSION
======================================================== */

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mysql = require("mysql2");

const app = express();

/* ========================================================
   CORS — ALWAYS FIRST!!
======================================================== */
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

/* ========================================================
   MYSQL CONNECTION (AIVEN)
======================================================== */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
});

// Test DB Connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database Connection Failed:", err.message);
  } else {
    console.log("✅ Connected to Aiven MySQL Database");
    connection.release();
  }
});

/* ========================================================
   SAFE QUERY (Promise Wrapper)
======================================================== */
function safeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

/* ========================================================
   KEEP ALIVE — NO await db.query() !!
======================================================== */
setInterval(() => {
  db.query("SELECT 1", () => {});
}, 30000);

/* ========================================================
   ROOT TEST
======================================================== */
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully!");
});

/* ========================================================
   LOGIN
======================================================== */
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

    res.json({
      success: true,
      employee: result[0],
    });
  } catch (err) {
    console.log("Login Error:", err.message);
    res.json({ success: false, message: "Server error" });
  }
});

/* ========================================================
   TRAVEL — GET
======================================================== */
app.get("/travel-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const sql = empld
      ? "SELECT * FROM TravelExpenses WHERE empld=? ORDER BY id DESC"
      : "SELECT * FROM TravelExpenses ORDER BY id DESC";

    const result = await safeQuery(sql, empld ? [empld] : []);

    res.json(result);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ========================================================
   TRAVEL — ADD
======================================================== */
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

/* ========================================================
   TICKET — GET
======================================================== */
app.get("/ticket-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const sql = empld
      ? "SELECT * FROM TicketExpenses WHERE empld=? ORDER BY id DESC"
      : "SELECT * FROM TicketExpenses ORDER BY id DESC";

    const result = await safeQuery(sql, empld ? [empld] : []);

    res.json(result);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ========================================================
   TICKET — ADD
======================================================== */
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

/* ========================================================
   START SERVER
======================================================== */
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on ${PORT}`);
});
