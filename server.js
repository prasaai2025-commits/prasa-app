// ======================================================
// PRASA Backend - EXPENSE + BILLS + HISTORY  (empld FIXED)
// ======================================================
console.log("🔥 PRASA Backend Starting...");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// -----------------------------
// CORS
// -----------------------------
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

// -----------------------------
// STATIC FILES (for bills)
//  => any path saved like /files/EMP001/filename.pdf
// -----------------------------
app.use("/files", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// MYSQL (Aiven)
// -----------------------------
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// -----------------------------
// ROOT TEST
// -----------------------------
app.get("/", (req, res) => {
  res.send("🚀 PRASA Backend Running Successfully!");
});

// -----------------------------
// LOGIN  (Employees table)
// Uses empId column, but returns as empld for frontend
// -----------------------------
app.post("/login", async (req, res) => {
  try {
    const { empld, password } = req.body;

    if (!empld || !password) {
      return res.json({ success: false, message: "Missing credentials" });
    }

    const sql = `
      SELECT 
        id,
        empId AS empld,
        empName AS name,
        email,
        phone,
        department,
        role,
        joiningDate
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

// -----------------------------
// TRAVEL EXPENSES  (uses column `empld` in table)
// -----------------------------
app.get("/travel-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const result = await query(
      `SELECT * FROM TravelExpenses WHERE empld = ? ORDER BY id DESC`,
      [empld]
    );

    res.json(result);
  } catch (err) {
    console.error("Travel GET Error:", err);
    res.json({ success: false, message: err.message });
  }
});

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

    const result = await query(sql, [
      empld,
      travel_date,
      purpose,
      amount,
      location_from,
      location_to,
      mode_of_travel || "",
    ]);

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Travel POST Error:", err);
    res.json({ success: false, message: err.message });
  }
});

// -----------------------------
// TICKET EXPENSES  (uses column `empld` in table)
// -----------------------------
app.get("/ticket-expenses", async (req, res) => {
  try {
    const { empld } = req.query;

    const result = await query(
      `SELECT * FROM TicketExpenses WHERE empld = ? ORDER BY id DESC`,
      [empld]
    );

    res.json(result);
  } catch (err) {
    console.error("Ticket GET Error:", err);
    res.json({ success: false, message: err.message });
  }
});

app.post("/ticket-expenses", async (req, res) => {
  try {
    const { empld, ticket_date, purpose, assigned_to, amount } = req.body;

    const sql = `
      INSERT INTO TicketExpenses
      (empld, ticket_date, purpose, assigned_to, amount, created_at)
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
    console.error("Ticket POST Error:", err);
    res.json({ success: false, message: err.message });
  }
});

// -----------------------------------------------------
// BILLS UPLOAD + HISTORY  (stored inside backend/uploads)
// uses column `empld` in Bills table
// -----------------------------------------------------

// Folder: backend/uploads/<empld>/
function getUserFolder(empld) {
  const folder = path.join(__dirname, "uploads", String(empld));
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log("📁 Created folder:", folder);
  }
  return folder;
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const empld = req.body.empld;
    const folder = getUserFolder(empld);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

// Upload bills route
//  - frontend sends field "bills" (multiple files)
//  - body also has "empld"
app.post("/upload-bills", upload.array("bills", 10), async (req, res) => {
  try {
    const empld = req.body.empld;

    if (!empld) {
      return res.json({ success: false, message: "Missing empld" });
    }

    if (!req.files || req.files.length === 0) {
      return res.json({ success: false, message: "No files uploaded" });
    }

    const files = req.files.map((f) => {
      // Public URL path used by frontend
      const filePath = `/files/${empld}/${f.filename}`;
      return {
        filename: f.filename,
        filePath,
      };
    });

    // Bills table MUST use `empld` now:
    //
    // CREATE TABLE Bills (
    //   id INT AUTO_INCREMENT PRIMARY KEY,
    //   empld VARCHAR(50) NOT NULL,
    //   fileName VARCHAR(255) NOT NULL,
    //   filePath VARCHAR(255) NOT NULL,
    //   created_at DATETIME NOT NULL
    // );
    //
    for (let bill of files) {
      await query(
        `INSERT INTO Bills (empld, fileName, filePath, created_at)
         VALUES (?, ?, ?, NOW())`,
        [empld, bill.filename, bill.filePath]
      );
    }

    res.json({
      success: true,
      message: "Bills uploaded successfully",
      files,
    });
  } catch (err) {
    console.error("Upload Bills Error:", err);
    res.json({ success: false, message: err.message });
  }
});

// Get bills for employee (used in History + Tools)
app.get("/bills", async (req, res) => {
  try {
    const { empld } = req.query;
    if (!empld) {
      return res.json({ success: false, message: "Missing empld" });
    }

    const result = await query(
      `SELECT id, empld, fileName, filePath, created_at 
       FROM Bills 
       WHERE empld = ? 
       ORDER BY id DESC`,
      [empld]
    );

    res.json(result);
  } catch (err) {
    console.error("Bills GET Error:", err);
    res.json({ success: false, message: err.message });
  }
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on PORT ${PORT}`)
);
