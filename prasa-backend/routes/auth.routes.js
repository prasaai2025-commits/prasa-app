import express from "express";
import pool from "../db.js";

const router = express.Router();

/* =======================
   EMPLOYEE LOGIN
======================= */
router.post("/login", async (req, res) => {
  try {
    // 🔍 Log once for safety (can be removed later)
    console.log("EMP LOGIN BODY:", req.body);

    // ✅ Normalize input
    const emp_id = req.body.emp_id ? req.body.emp_id.trim() : null;
    const password = req.body.password ? req.body.password.trim() : null;

    if (!emp_id || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    /**
     * 🔥 VERY IMPORTANT FIX
     * - Handles CHAR columns (space padded)
     * - Handles case mismatch
     */
    const [rows] = await pool.query(
      `SELECT 
         TRIM(emp_id) AS emp_id,
         emp_name,
         email,
         phone,
         department,
         role,
         joining_date,
         TRIM(password) AS password
       FROM Employees
       WHERE TRIM(UPPER(emp_id)) = TRIM(UPPER(?))
       LIMIT 1`,
      [emp_id]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Invalid Employee ID" });
    }

    const user = rows[0];

    // 🔐 Safe password comparison
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ SUCCESS RESPONSE (dashboard depends on this)
    return res.json({
      success: true,
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
    console.error("EMP LOGIN ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* =======================
   EMPLOYEE LIST
   (Used in Ticket System)
======================= */
router.get("/employees", async (req, res) => {
  try {
    const exclude = req.query.exclude;

    let sql = "SELECT TRIM(emp_id) AS emp_id, emp_name FROM Employees";
    let params = [];

    if (exclude) {
      sql += " WHERE TRIM(emp_id) != TRIM(?)";
      params.push(exclude);
    }

    const [rows] = await pool.query(sql, params);
    return res.json(rows);

  } catch (err) {
    console.error("EMPLOYEE FETCH ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch employees" });
  }
});

export default router;
