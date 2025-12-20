import express from "express";
import pool from "../db.js";

const router = express.Router();

/* ======================
   ADMIN LOGIN
====================== */
router.post("/login", async (req, res) => {
  try {
    console.log("ADMIN LOGIN BODY:", req.body);

    // 🔥 IMPORTANT: trim inputs
    const admin_id = req.body.admin_id?.trim();
    const password = req.body.password?.trim();

    if (!admin_id || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const [rows] = await pool.query(
      "SELECT admin_id, password FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    console.log("ADMIN DB ROW:", rows);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid admin ID" });
    }

    if (rows[0].password.trim() !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ SUCCESS
    res.json({
      success: true,
      admin: {
        admin_id: rows[0].admin_id,
        role: "ADMIN",
      },
    });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Admin login failed" });
  }
});

export default router;
