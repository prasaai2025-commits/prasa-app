import express from "express";
import db from "../db.js";

const router = express.Router();

/*
  ===========================
  APPROVED EXPENSES HISTORY
  ===========================
*/
router.get("/expenses", async (req, res) => {
  try {
    const { emp_id, from, to } = req.query;

    let query = `
      SELECT 
        id,
        expense_date AS date,
        description,
        amount,
        voucher_path,
        status
      FROM expenses
      WHERE status='approved'
    `;

    const params = [];

    // employee filter
    if (emp_id) {
      query += " AND emp_id = ?";
      params.push(emp_id);
    }

    // date from filter
    if (from) {
      query += " AND expense_date >= ?";
      params.push(from);
    }

    // date to filter
    if (to) {
      query += " AND expense_date <= ?";
      params.push(to);
    }

    query += " ORDER BY expense_date DESC";

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (err) {
    console.error("EXPENSE HISTORY ERROR:", err);
    res.status(500).json({ message: "Failed to load expense history" });
  }
});

/*
  ===========================
  APPROVED / COMPLETED TICKETS
  ===========================
*/
router.get("/ticket-system", async (req, res) => {
  try {
    const { emp_id, from, to } = req.query;

    let query = `
      SELECT 
        id,
        ticket_date AS date,
        description,
        assigned_to,
        attachment_paths,
        status
      FROM ticket_system
      WHERE status IN ('approved','completed')
    `;

    const params = [];

    // employee filter
    if (emp_id) {
      query += " AND emp_id = ?";
      params.push(emp_id);
    }

    // date from filter
    if (from) {
      query += " AND ticket_date >= ?";
      params.push(from);
    }

    // date to filter
    if (to) {
      query += " AND ticket_date <= ?";
      params.push(to);
    }

    query += " ORDER BY ticket_date DESC";

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (err) {
    console.error("TICKET HISTORY ERROR:", err);
    res.status(500).json({ message: "Failed to load ticket history" });
  }
});

export default router;
