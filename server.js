// ==========================
// PRASA BACKEND - FINAL VERSION
// Supports:
// - ONE API (all DB actions)
// - PDF report generator
// - File upload (PDF + images)
// - Auto-create /uploads & /reports
// ==========================

// ==========================
// PRASA BACKEND - FINAL VERSION
// ONE API + CORS FIX
// ==========================
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// REQUIRED FOR RENDER HEALTH CHECK
app.get("/", (req, res) => {
  res.send("PRASA BACKEND WORKING ✔");
});

// FULL OPEN CORS
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("/api/app", cors());

// DB CONNECTION
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// SINGLE API HANDLER
app.post("/api/app", (req, res) => {
  const action = req.body.action;

  if (action === "login") {
    const { empId, password } = req.body;

    db.query(
      "SELECT * FROM Employees WHERE empId=? AND password=?",
      [empId, password],
      (err, results) => {
        if (err) return res.json({ success: false, message: "Server Error" });
        if (results.length === 0)
          return res.json({ success: false, message: "Invalid ID or Password" });

        return res.json({ success: true, employee: results[0] });
      }
    );
    return;
  }

  return res.json({ success: false, message: "Invalid action" });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () =>
  console.log(`🔥 PRASA One-API Backend Running on Port ${PORT}`)
);
