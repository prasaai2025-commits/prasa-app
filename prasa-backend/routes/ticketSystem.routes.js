import express from "express";
import pool from "../db.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* CREATE TICKET */
router.post("/", upload.array("attachments", 5), async (req, res) => {
  try {
    const { emp_id, ticket_date, description, assigned_to } = req.body;
    const files = req.files?.map(f => `/uploads/${f.filename}`).join(",") || null;

    await pool.query(
      `INSERT INTO ticket_system
       (emp_id, ticket_date, description, assigned_to, status, attachment_paths)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [emp_id, ticket_date, description, assigned_to, files]
    );

    res.json({ message: "Ticket created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ticket save failed" });
  }
});

/* ACTIVE TICKETS (pending + WIP) */
router.get("/active", async (req, res) => {
  const emp_id = "EMP001";

  const [rows] = await pool.query(
    `SELECT * FROM ticket_system
     WHERE emp_id=? AND status IN ('pending','WIP')
     ORDER BY ticket_date DESC`,
    [emp_id]
  );

  res.json(rows);
});

/* 📊 NEW — EMPLOYEE TICKET SUMMARY FOR GRAPH */
router.get("/employee/summary/:emp_id", async (req, res) => {
  try {
    const { emp_id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT LOWER(status) AS status, COUNT(*) AS total
      FROM ticket_system
      WHERE emp_id = ? OR assigned_to = ?
      GROUP BY LOWER(status)
      `,
      [emp_id, emp_id]
    );

    const result = { pending: 0, wip: 0, completed: 0 };

    rows.forEach(r => {
      if (r.status.includes("complete")) result.completed = r.total;
      else if (r.status.includes("wip")) result.wip = r.total;
      else result.pending = r.total;
    });

    res.json(result);

  } catch (err) {
    console.error("TICKET GRAPH SUMMARY ERROR:", err);
    res.status(500).json({ message: "Summary load failed" });
  }
});

export default router;
