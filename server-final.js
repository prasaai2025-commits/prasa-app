console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const mysql = require("mysql2/promise"); // <<< FIXED
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

// ----------------------------------------------------
// ✅ CORS — 100% FIX (BYPASSES ALL ISSUES)
// ----------------------------------------------------
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Render sends OPTIONS → we answer YES
app.options("*", (req, res) => res.sendStatus(200));

// ----------------------------------------------------
// ✅ MYSQL CONNECTION (AIVEN)
// ----------------------------------------------------
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
    connectionLimit: 5,
  });

  console.log("✅ Connected to Aiven MySQL Database");
}

connectDB().catch((err) => {
  console.error("❌ DB connection failed:", err.message);
});

// ----------------------------------------------------
// Helper: Safe Query Promise Wrapper
// ----------------------------------------------------
async function safeQuery(sql, params = []) {
  const [rows] = await db.query(sql, params);
  return rows;
}

// ----------------------------------------------------
// ROOT TEST
// ----------------------------------------------------
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully!");
});

// ----------------------------------------------------
// LOGIN
// ----------------------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    const rows = await safeQuery(
      "SELECT * FROM Employees WHERE empld = ? AND password = ? LIMIT 1",
      [empld, password]
    );

    if (rows.length === 0)
      return res.json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    console.log("Login Error:", err);
    res.json({ success: false, message: "Server error" });
  }
});

// ----------------------------------------------------
// TRAVEL API
// ----------------------------------------------------
app.get("/travel-expenses", async (req, res) => {
  try {
    const rows = await safeQuery(
      "SELECT * FROM TravelExpenses WHERE empld = ? ORDER BY id DESC",
      [req.query.empld]
    );
    res.json(rows);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post("/travel-expenses", async (req, res) => {
  try {
    const { empld, travel_date, purpose, amount, location_from, location_to } =
      req.body;

    const result = await safeQuery(
      "INSERT INTO TravelExpenses (empld, travel_date, purpose, amount, location_from, location_to, created_at) VALUES (?,?,?,?,?,?,NOW())",
      [empld, travel_date, purpose, amount, location_from, location_to]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// TICKET API
// ----------------------------------------------------
app.get("/ticket-expenses", async (req, res) => {
  try {
    const rows = await safeQuery(
      "SELECT * FROM TicketExpenses WHERE empld = ? ORDER BY id DESC",
      [req.query.empld]
    );
    res.json(rows);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post("/ticket-expenses", async (req, res) => {
  try {
    const { empld, ticket_date, purpose, assigned_to, amount } = req.body;

    const result = await safeQuery(
      "INSERT INTO TicketExpenses (empld, ticket_date, purpose, assigned_to, amount, created_at) VALUES (?,?,?,?,?,NOW())",
      [empld, ticket_date, purpose, assigned_to, amount]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Backend running on PORT ${PORT}`)
);
