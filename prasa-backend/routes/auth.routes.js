const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", async (req, res) => {
  const { empId, password } = req.body;

  if (!empId || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM Employees WHERE empld = ? AND password = ?",
      [empId, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;
