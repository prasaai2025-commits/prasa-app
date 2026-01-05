import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

/*
  =========================================
  ADMIN LOGIN
  =========================================
*/
router.post("/login", async (req, res) => {
  try {
    const { admin_id, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    const admin = rows[0];

    // If your passwords are NOT hashed, use plain compare
    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // If you later hash passwords, replace with bcrypt.compare()

    res.json({
      success: true,
      message: "Admin login successful",
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

/*
  =========================================
  DASHBOARD SUMMARY CARDS
  =========================================
*/
router.get("/summary", async (req, res) => {
  try {
    const [[approvedTotal]] = await pool.query(
      "SELECT SUM(amount) as total FROM expenses WHERE status='approved'"
    );

    const [[pendingExp]] = await pool.query(
      "SELECT COUNT(*) as c FROM expenses WHERE status='pending'"
    );

    const [[pendingTickets]] = await pool.query(
      "SELECT COUNT(*) as c FROM ticket_system WHERE status='pending'"
    );

    res.json({
      approvedAmount: approvedTotal?.total || 0,
      pendingExpenses: pendingExp?.c || 0,
      pendingTickets: pendingTickets?.c || 0,
    });

  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(500).json({ message: "Failed to load summary" });
  }
});

/*
  =========================================
  EXPENSE APPROVAL SECTION
  =========================================
*/

/* get all pending expenses */
router.get("/expenses/pending", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM expenses WHERE status='pending' ORDER BY expense_date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("EXPENSE PENDING ERROR:", err);
    res.status(500).json({ message: "Failed to load pending expenses" });
  }
});

/* approve expense */
router.put("/expenses/:id/approve", async (req, res) => {
  try {
    await pool.query(
      "UPDATE expenses SET status='approved' WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("EXPENSE APPROVE ERROR:", err);
    res.status(500).json({ message: "Approve failed" });
  }
});

/* reject expense */
router.put("/expenses/:id/reject", async (req, res) => {
  try {
    await pool.query(
      "UPDATE expenses SET status='rejected' WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("EXPENSE REJECT ERROR:", err);
    res.status(500).json({ message: "Reject failed" });
  }
});

/*
  =========================================
  TICKET APPROVAL SECTION
  =========================================
*/

/* get pending tickets */
router.get("/tickets/pending", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM ticket_system WHERE status='pending' ORDER BY ticket_date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("TICKET PENDING ERROR:", err);
    res.status(500).json({ message: "Failed to load pending tickets" });
  }
});

/* approve ticket */
router.put("/tickets/:id/approve", async (req, res) => {
  try {
    await pool.query(
      "UPDATE ticket_system SET status='approved' WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("TICKET APPROVE ERROR:", err);
    res.status(500).json({ message: "Approve failed" });
  }
});

/* reject ticket */
router.put("/tickets/:id/reject", async (req, res) => {
  try {
    await pool.query(
      "UPDATE ticket_system SET status='rejected' WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("TICKET REJECT ERROR:", err);
    res.status(500).json({ message: "Reject failed" });
  }
});

export default router;
