///////////////////////////////////////////////////////////
//  PRASA BACKEND - FINAL CORS + MYSQL + LOGIN FIX
///////////////////////////////////////////////////////////

console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mysql = require("mysql2/promise");  // IMPORTANT: PROMISE VERSION

const app = express();

// --------------------------------------------------------
// CORS FIX (WORKS FOR LOCALHOST 3000, 3001, AND RENDER)
// --------------------------------------------------------
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "*"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// --------------------------------------------------------
// BODY PARSER
// --------------------------------------------------------
app.use(express.json());

// --------------------------------------------------------
// MYSQL CONNECTION (AIVEN DB)
// --------------------------------------------------------
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// TEST DB
app.get("/", (req, res) => res.send("🚀 PRASA Backend Running Successfully!"));

// --------------------------------------------------------
// LOGIN ROUTE (THE MOST IMPORTANT FIXED)
// --------------------------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    if (!empld || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing credentials" });

    const [rows] = await db.query(
      `SELECT id, empld, empName, email, phone, department, role, joiningDate 
       FROM Employees WHERE empld=? AND password=? LIMIT 1`,
      [empld, password]
    );

    if (rows.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------------------------------------------------
// TRAVEL EXPENSES
// --------------------------------------------------------
app.get("/travel-expenses", async (req, res) => {
  try {
    const { empld } = req.query;
    const [rows] = await db.query(
      `SELECT * FROM TravelExpenses WHERE empld=? ORDER BY id DESC`,
      [empld]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/travel-expenses", async (req, res) => {
  try {
    const { empld, travel_date, purpose, amount, location_from, location_to } =
      req.body;

    const [result] = await db.query(
      `INSERT INTO TravelExpenses 
       (empld, travel_date, purpose, amount, location_from, location_to, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        empld,
        travel_date,
        purpose,
        amount,
        location_from || null,
        location_to || null,
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// --------------------------------------------------------
// START SERVER
// --------------------------------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Backend running on ${PORT}`)
);
