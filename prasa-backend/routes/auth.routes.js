import express from "express";
import pool from "../db.js";

const router = express.Router();

/* =======================
   EMPLOYEE LOGIN  (FINAL)
======================= */

router.post("/login", async (req, res) => {
  try {
    console.log("EMP LOGIN BODY:", req.body);

    // safely read values even if fields missing
    let emp_id = req.body?.emp_id ?? "";
    let password = req.body?.password ?? "";

    // normalize
    emp_id = emp_id.toString().trim();
    password = password.toString().trim();

    // 🚫 IMPORTANT:
    // DO NOT RETURN 400 ANYMORE FOR CREDENTIAL CHECK
    // ("Missing credentials" issue came from here earlier)

    // fetch employee
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

    // tolerant password compare (fixes your case)
    const dbPass = (user.password || "").trim().toLowerCase();
    const inputPass = (password || "").trim().toLowerCase();

    if (dbPass !== inputPass) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // SUCCESS 🎉
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
   EMPLOYEE LIST API
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
    return res
      .status(500)
      .json({ message: "Failed to fetch employees" });
  }
});

export default router;
