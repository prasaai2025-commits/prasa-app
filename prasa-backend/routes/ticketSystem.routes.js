import express from "express";
import pool from "../db.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* CREATE TICKET */
router.post("/", upload.array("attachments", 5), async (req, res) => {
  const { emp_id, ticket_date, description, assigned_to } = req.body;
  const files = req.files.map(f => `/uploads/${f.filename}`).join(",");

  await pool.query(
    `INSERT INTO ticket_system 
     (emp_id, ticket_date, description, assigned_to, status, attachment_paths)
     VALUES (?, ?, ?, ?, 'pending', ?)`,
    [emp_id, ticket_date, description, assigned_to, files]
  );

  res.json({ message: "Ticket created" });
});

/* EMPLOYEE ACTIVE (PENDING + WIP + REJECTED) */
router.get("/active", async (req, res) => {
  const emp_id = "EMP001";

  const [rows] = await pool.query(
    `SELECT * FROM ticket_system
     WHERE emp_id = ?
       AND status IN ('pending','WIP','rejected')
     ORDER BY ticket_date DESC`,
    [emp_id]
  );

  res.json(rows);
});

/* 🔥 ACCEPT TICKET */
router.put("/:id/accept", async (req, res) => {
  await pool.query(
    `UPDATE ticket_system SET status='WIP' WHERE id=?`,
    [req.params.id]
  );
  res.json({ message: "Ticket accepted" });
});

/* 🔥 COMPLETE TICKET */
router.put("/:id/complete", async (req, res) => {
  await pool.query(
    `UPDATE ticket_system SET status='completed' WHERE id=?`,
    [req.params.id]
  );
  res.json({ message: "Ticket completed" });
});

/* ================================
   🔥 NEW: EMPLOYEE TICKET SUMMARY
   (FOR GRAPH PAGE)
================================ */
router.get("/employee/summary/:emp_id", async (req, res) => {
  const { emp_id } = req.params;

  const [rows] = await pool.query(
    `SELECT status, COUNT(*) total
     FROM ticket_system
     WHERE emp_id = ?
     GROUP BY status`,
    [emp_id]
  );

  const summary = { completed: 0, wip: 0, pending: 0 };

  rows.forEach(r => {
    summary[r.status.toLowerCase()] = Number(r.total);
  });

  res.json(summary);
});

export default router;
