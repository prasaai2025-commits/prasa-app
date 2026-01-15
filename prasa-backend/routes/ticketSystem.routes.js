import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import db from "../db.js";

const router = express.Router();

/* Ensure uploads folder exists */
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* Multer */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

/* Create ticket */
router.post("/", upload.array("attachments"), async (req, res) => {
  try {
    const { emp_id, ticket_date, assigned_to, description } = req.body;

    await db.query(
      `INSERT INTO ticket_system (emp_id, ticket_date, assigned_to, description, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [emp_id, ticket_date, assigned_to || null, description]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to create ticket" });
  }
});

/* Get pending */
router.get("/pending/:emp_id", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM ticket_system WHERE emp_id=? AND LOWER(status)='pending' ORDER BY id DESC",
    [req.params.emp_id]
  );
  res.json(rows);
});

/* Get history */
router.get("/history/:emp_id", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM ticket_system WHERE emp_id=? AND LOWER(status)!='pending' ORDER BY id DESC",
    [req.params.emp_id]
  );
  res.json(rows);
});

/* 🔥 THIS ROUTE IS MISSING ON RENDER */
router.put("/:id", upload.array("attachments"), async (req, res) => {
  try {
    const { ticket_date, assigned_to, description } = req.body;

    const [result] = await db.query(
      "UPDATE ticket_system SET ticket_date=?, assigned_to=?, description=? WHERE id=?",
      [ticket_date, assigned_to || null, description, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
