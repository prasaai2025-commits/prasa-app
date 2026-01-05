import express from "express";
import pool from "../db.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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

export default router;
