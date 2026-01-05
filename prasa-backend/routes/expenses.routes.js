import express from "express";
import pool from "../db.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* 🔥 CONFIRM ROUTE IS LIVE */
router.get("/", (req, res) => {
  res.json({ ok: true, route: "/api/expenses working" });
});

/* ➕ CREATE EXPENSE (default status = pending) */
router.post("/", upload.single("voucher"), async (req, res) => {
  try {
    const { emp_id, expense_date, description, amount } = req.body;
    const voucher_path = req.file ? `/uploads/${req.file.filename}` : null;

    if (!emp_id) {
      return res.status(400).json({ message: "emp_id is required" });
    }

    await pool.query(
      `INSERT INTO expenses
       (emp_id, expense_date, description, amount, voucher_path, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [emp_id, expense_date, description, amount, voucher_path]
    );

    res.json({ success: true, message: "Expense submitted" });

  } catch (err) {
    console.error("INSERT ERROR:", err);
    res.status(500).json({ message: "Expense save failed" });
  }
});

/* ✏ UPDATE EXPENSE */
router.put("/:id", upload.single("voucher"), async (req, res) => {
  try {
    const { expense_date, description, amount } = req.body;
    const voucher_path = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      `UPDATE expenses
       SET expense_date = ?, description = ?, amount = ?,
           voucher_path = COALESCE(?, voucher_path)
       WHERE id = ?`,
      [expense_date, description, amount, voucher_path, req.params.id]
    );

    res.json({ success: true, message: "Expense updated" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Expense update failed" });
  }
});

/* ❌ DELETE */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM expenses WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Expense deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Expense delete failed" });
  }
});

/* 🟡 EMPLOYEE ACTIVE (pending + rejected) */
router.get("/active", async (req, res) => {
  try {
    const { emp_id } = req.query;

    const [rows] = await pool.query(
      `SELECT * FROM expenses
       WHERE emp_id = ? 
       AND status IN ('pending','rejected')
       ORDER BY expense_date DESC`,
      [emp_id]
    );

    res.json(rows);

  } catch (err) {
    console.error("ACTIVE FETCH ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* 🟢 EMPLOYEE HISTORY (approved only) */
router.get("/history", async (req, res) => {
  try {
    const { emp_id } = req.query;

    const [rows] = await pool.query(
      `SELECT * FROM expenses
       WHERE emp_id = ? 
       AND status = 'approved'
       ORDER BY expense_date DESC`,
      [emp_id]
    );

    res.json(rows);

  } catch (err) {
    console.error("HISTORY FETCH ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

export default router;
