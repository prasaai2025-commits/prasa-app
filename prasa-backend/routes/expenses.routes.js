import express from "express";
import pool from "../db.js";
import multer from "multer";

const router = express.Router();

/* FILE UPLOAD */
const upload = multer({ dest: "uploads/" });

/* CREATE EXPENSE (EMPLOYEE) */
router.post("/", upload.single("voucher"), async (req, res) => {
  try {
    const { emp_id, expense_date, description, amount } = req.body;
    const voucher_path = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      `INSERT INTO expenses 
       (emp_id, expense_date, description, amount, voucher_path, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [emp_id, expense_date, description, amount, voucher_path]
    );

    res.json({ message: "Expense submitted (pending approval)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Expense save failed" });
  }
});

/* EMPLOYEE ACTIVE (PENDING + REJECTED) */
router.get("/active", async (req, res) => {
  const emp_id = "EMP001";

  const [rows] = await pool.query(
    `SELECT * FROM expenses
     WHERE emp_id = ? AND status IN ('pending','rejected')
     ORDER BY expense_date DESC`,
    [emp_id]
  );

  res.json(rows);
});

/* ORIGINAL EMPLOYEE ROUTE (UNCHANGED) */
router.get("/employee/:emp_id", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM expenses
     WHERE emp_id = ? AND status IN ('pending','rejected')
     ORDER BY expense_date DESC`,
    [req.params.emp_id]
  );
  res.json(rows);
});

/* 🔥 ADMIN: VIEW PENDING EXPENSES */
router.get("/admin/pending", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM expenses WHERE status='pending' ORDER BY expense_date DESC`
  );
  res.json(rows);
});

/* 🔥 ADMIN: APPROVE EXPENSE */
router.put("/:id/approve", async (req, res) => {
  await pool.query(
    `UPDATE expenses SET status='approved' WHERE id=?`,
    [req.params.id]
  );
  res.json({ message: "Expense approved" });
});

/* 🔥 ADMIN: REJECT EXPENSE */
router.put("/:id/reject", async (req, res) => {
  await pool.query(
    `UPDATE expenses SET status='rejected' WHERE id=?`,
    [req.params.id]
  );
  res.json({ message: "Expense rejected" });
});

/* ================================
   🔥 NEW: EMPLOYEE EXPENSE SUMMARY
   (FOR GRAPH PAGE)
================================ */
router.get("/employee/summary/:emp_id", async (req, res) => {
  const { emp_id } = req.params;

  const [rows] = await pool.query(
    `SELECT status, SUM(amount) total
     FROM expenses
     WHERE emp_id = ?
     GROUP BY status`,
    [emp_id]
  );

  const summary = { approved: 0, pending: 0, rejected: 0 };

  rows.forEach(r => {
    summary[r.status] = Number(r.total);
  });

  res.json(summary);
});

export default router;
