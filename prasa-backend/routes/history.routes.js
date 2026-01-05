import express from "express";
import db from "../db.js";

const router = express.Router();

/*
  ===========================
  APPROVED EXPENSE HISTORY
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
      WHERE LOWER(status)='approved'
    `;

    const params = [];

    // employee filter
    if (emp_id) {
      query += " AND emp_id = ?";
      params.push(emp_id);
    }

    // date from
    if (from) {
      query += " AND expense_date >= ?";
      params.push(from);
    }

    // date to
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
  ==========================================
  APPROVED / COMPLETED TICKET HISTORY
  ==========================================
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
      WHERE LOWER(status) IN ('approved','completed')
    `;

    const params = [];

    // created by or assigned to employee
    if (emp_id) {
      query += " AND (emp_id = ? OR assigned_to = ?)";
      params.push(emp_id, emp_id);
    }

    if (from) {
      query += " AND ticket_date >= ?";
      params.push(from);
    }

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
