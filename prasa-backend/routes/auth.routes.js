import express from "express";
import pool from "../db.js";

const router = express.Router();

/* =======================
   EMPLOYEE LOGIN – FINAL
======================= */
router.post("/login", async (req, res) => {
  try {
    console.log("🔥 LOGIN HIT");
    console.log("📩 RAW BODY =", req.body);

    // 🧹 Clean ALL hidden characters (spaces, tabs, \r, \n)
    const emp_id_raw = req.body.emp_id || "";
    const password_raw = req.body.password || "";

    const emp_id = emp_id_raw.replace(/\s+/g, "").toUpperCase();
    const password = password_raw.replace(/[\r\n]+/g, "").trim();

    console.log("🆔 CLEAN EMP_ID =", emp_id);
    console.log("🔑 CLEAN PASSWORD =", password);

    if (!emp_id || !password) {
      console.log("⛔ Missing credentials");
      return res.status(400).json({ message: "Missing credentials" });
    }

    // 🛠 Fetch employee
    const [rows] = await pool.query(
      `SELECT 
          TRIM(UPPER(emp_id)) AS emp_id,
          TRIM(password) AS password,
          emp_name,
          email,
          phone,
          department,
          role,
          joining_date
       FROM Employees
       WHERE REPLACE(TRIM(UPPER(emp_id)), ' ', '') = ?
       LIMIT 1`,
      [emp_id]
    );

    console.log("📦 DB RESULT =", rows);

    if (!rows || rows.length === 0) {
      console.log("⛔ Invalid ID");
      return res.status(401).json({ message: "Invalid Employee ID" });
    }

    const user = rows[0];

    console.log("🔍 DB PASSWORD =", user.password);
    console.log("🔍 INPUT PASSWORD =", password);

    // ✅ NORMALIZE BOTH PASSWORDS
    const db_pass = user.password.replace(/[\r\n]+/g, "").trim();

    if (db_pass !== password) {
      console.log("⛔ Password mismatch");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("✅ LOGIN SUCCESS");

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
    console.error("💥 LOGIN ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
