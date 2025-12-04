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

// =============================
// ✔ FIXED CORS FOR LOCALHOST + RENDER
// =============================
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"]
  })
);

// 🔥 VERY IMPORTANT — FIX OPTIONS (preflight)
app.options("/api/app", cors());   // ← ← ← ADD THIS LINE

// =========================
// MySQL Database Connection
// =========================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// =========================
// ONE-API ROUTE (ALL ACTIONS)
// =========================
app.post("/api/app", async (req, res) => {
  const action = req.body.action;

  try {
    switch (action) {
      // -------------------------
      // LOGIN
      // -------------------------
      case "login": {
        const { empId, password } = req.body;

        db.query(
          "SELECT * FROM Employees WHERE empId = ? AND password = ?",
          [empId, password],
          (err, results) => {
            if (err) return res.json({ success: false, message: "Server Error" });

            if (results.length === 0) {
              return res.json({ success: false, message: "Invalid ID or Password" });
            }

            return res.json({ success: true, employee: results[0] });
          }
        );
        break;
      }

      // -------------------------
      // DASHBOARD SUMMARY
      // -------------------------
      case "dashboard": {
        const { empId } = req.body;

        db.query(
          `SELECT 
            (SELECT IFNULL(SUM(amount),0) FROM TravelExpenses WHERE empId=?) AS totalTravel,
            (SELECT IFNULL(SUM(amount),0) FROM TicketExpenses WHERE empId=?) AS totalTicket,
            (SELECT COUNT(*) FROM Bills WHERE empId=?) AS totalBills`,
          [empId, empId, empId],
          (err, results) => {
            if (err) return res.json({ success: false, message: "Server Error" });

            return res.json({ success: true, dashboard: results[0] });
          }
        );
        break;
      }

      // -------------------------
      // ADD TRAVEL EXPENSE
      // -------------------------
      case "addTravel": {
        const { empId, travel_date, location_from, location_to, purpose, mode_of_travel, amount } =
          req.body;

        db.query(
          `INSERT INTO TravelExpenses (empId, travel_date, location_from, location_to, purpose, mode_of_travel, amount)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            empId,
            travel_date,
            location_from,
            location_to,
            purpose,
            mode_of_travel,
            amount,
          ],
          (err) => {
            if (err) return res.json({ success: false, message: "Server Error" });

            return res.json({ success: true });
          }
        );

        break;
      }

      // -------------------------
      // ADD TICKET
      // -------------------------
      case "addTicket": {
        const { empId, ticket_date, purpose, assigned_to, amount } = req.body;

        db.query(
          `INSERT INTO TicketExpenses (empId, ticket_date, purpose, assigned_to, amount)
           VALUES (?, ?, ?, ?, ?)`,
          [empId, ticket_date, purpose, assigned_to, amount],
          (err) => {
            if (err) return res.json({ success: false, message: "Server Error" });

            return res.json({ success: true });
          }
        );

        break;
      }

      // -------------------------
      // HISTORY
      // -------------------------
      case "getHistory": {
        const { empId } = req.body;

        let history = { travel: [], ticket: [] };

        db.query(
          "SELECT * FROM TravelExpenses WHERE empId=? ORDER BY travel_date DESC",
          [empId],
          (err, travelRows) => {
            if (err) return res.json({ success: false });

            history.travel = travelRows;

            db.query(
              "SELECT * FROM TicketExpenses WHERE empId=? ORDER BY ticket_date DESC",
              [empId],
              (err2, ticketRows) => {
                if (err2) return res.json({ success: false });

                history.ticket = ticketRows;

                return res.json({ success: true, history });
              }
            );
          }
        );
        break;
      }

      // -------------------------
      // GRAPH MONTHLY SUMMARY
      // -------------------------
      case "getGraphData": {
        const { empId } = req.body;

        db.query(
          "SELECT * FROM ExpenseSummary WHERE empId=? ORDER BY month_year ASC",
          [empId],
          (err, rows) => {
            if (err) return res.json({ success: false });

            return res.json({ success: true, graph: rows });
          }
        );
        break;
      }

      // -------------------------
      // UPLOAD BILL METADATA
      // -------------------------
      case "uploadBill": {
        const { empId, file_name, file_path, month_year } = req.body;

        db.query(
          "INSERT INTO Bills (empId, file_name, file_path, month_year) VALUES (?, ?, ?, ?)",
          [empId, file_name, file_path, month_year],
          (err) => {
            if (err) return res.json({ success: false });

            return res.json({ success: true });
          }
        );
        break;
      }

      // -------------------------
      // GENERATE REPORT
      // -------------------------
      case "generateReport": {
        const { empId, report_month, total_travel, total_ticket } = req.body;

        db.query(
          `INSERT INTO Reports (empId, report_month, total_travel, total_ticket)
           VALUES (?, ?, ?, ?)`,
          [empId, report_month, total_travel, total_ticket],
          (err) => {
            if (err) return res.json({ success: false });

            return res.json({ success: true });
          }
        );
        break;
      }

      // -------------------------
      default:
        return res.json({ success: false, message: "Invalid action" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Server Error" });
  }
});

// =============================
// SERVER START
// =============================
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`🔥 PRASA One-API Backend Running on Port ${PORT}`);
});
