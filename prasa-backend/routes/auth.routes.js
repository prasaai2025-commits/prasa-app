import express from "express";
import pool from "../db.js";

const router = express.Router();

/* =======================
   EMPLOYEE LOGIN (FINAL WORKING)
======================= */

router.post("/login", async (req, res) => {
  try {
    console.log("🔥 LOGIN HIT");
    console.log("📩 RAW BODY =", req.body);

    // safely read incoming values
    let emp_id = req.body?.emp_id ?? "";
    let password = req.body?.password ?? "";

    // normalize incoming values
    emp_id = emp_id.toString().trim().toUpperCase();
    password = password.toString().trim();

    console.log("🆔 NORMALIZED EMP_ID =", emp_id);
    console.log("🔑 NORMALIZED PASSWORD =", password);

    // --- DB LOOKUP WITH HARD TRIM (REMOVES HIDDEN CHARACTERS)
    const [rows] = await pool.query(
      `
      SELECT 
        TRIM(REPLACE(REPLACE(REPLACE(UPPER(emp_id), CHAR(13), ''), CHAR(10), ''), ' ', '')) AS emp_id,
        TRIM(REPLACE(REPLACE(REPLACE(password, CHAR(13), ''), CHAR(10), ''), ' ', '')) AS password,
        emp_name,
        email,
        phone,
        department,
        role,
        joining_date
      FROM Employees
      WHERE TRIM(REPLACE(REPLACE(REPLACE(UPPER(emp_id), CHAR(13), ''), CHAR(10), ''), ' ', '')) = ?
      LIMIT 1
      `,
      [emp_id]
    );

    console.log("📦 DB RESULT =", rows);

    if (!rows || rows.length === 0) {
      console.log("❌ INVALID ID IN DB CHECK");
      return res.status(401).json({ message: "Invalid Employee ID" });
    }

    const user = rows[0];

    const dbPass = (user.password || "").trim();
    const inputPass = (password || "").trim();

    console.log("🔍 DB PASS =", dbPass);
    console.log("🔍 INPUT PASS =", inputPass);

    if (dbPass !== inputPass) {
      console.log("❌ INVALID PASSWORD");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("✅ LOGIN SUCCESS FOR", user.emp_id);

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

/* =======================
   EMPLOYEE LIST
======================= */

router.get("/employees", async (req, res) => {
  try {
    const exclude = req.query.exclude;

    let sql =
      "SELECT TRIM(emp_id) AS emp_id, emp_name FROM Employees";
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
