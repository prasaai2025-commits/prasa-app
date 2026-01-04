import express from "express";
import pool from "../db.js";

const router = express.Router();

/* =======================
   EMPLOYEE LOGIN — FINAL
======================= */

router.post("/login", async (req, res) => {
  try {
    console.log("🔥 LOGIN HIT");
    console.log("📩 RAW BODY =", req.body);

    // Normalize input safely
    const emp_id = (req.body.emp_id || "").trim().toUpperCase();
    const password = (req.body.password || "").trim();

    console.log("🆔 CLEAN EMP_ID =", emp_id);
    console.log("🔑 CLEAN PASSWORD =", password);

    if (!emp_id || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // MAIN FIX → trim + uppercase on BOTH SIDES
    const [rows] = await pool.query(
      `
      SELECT 
        TRIM(UPPER(emp_id)) AS emp_id,
        TRIM(password) AS password,
        emp_name,
        email,
        phone,
        department,
        role,
        joining_date
      FROM Employees
      WHERE TRIM(UPPER(emp_id)) = TRIM(UPPER(?))
      LIMIT 1
      `,
      [emp_id]
    );

    console.log("📦 DB RESULT =", rows);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Invalid Employee ID" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("✅ LOGIN SUCCESS FOR =", user.emp_id);

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        emp_id: user.emp_id,
        emp_name: user.emp_name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        joining_date: user.joining_date,
      },
    });
  } catch (err) {
    console.error("💥 LOGIN ERROR =", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
