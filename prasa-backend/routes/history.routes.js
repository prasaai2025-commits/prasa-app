import express from "express";
import db from "../db.js";

const router = express.Router();

/* APPROVED EXPENSES */
router.get("/expenses", async (req, res) => {
  const [rows] = await db.query(`
    SELECT expense_date AS date, description, amount, voucher_path
    FROM expenses
    WHERE status='approved'
    ORDER BY expense_date DESC
  `);
  res.json(rows);
});

/* COMPLETED TICKETS */
router.get("/ticket-system", async (req, res) => {
  const [rows] = await db.query(`
    SELECT ticket_date AS date, description, assigned_to, attachment_paths
    FROM ticket_system
    WHERE status='completed'
    ORDER BY ticket_date DESC
  `);
  res.json(rows);
});

export default router;
