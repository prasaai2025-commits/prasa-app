// controllers/authController.js
const pool = require("../config/db.js");

exports.login = (req, res) => {
  const { empId, password } = req.body;

  if (!empId || !password) {
    return res.status(400).json({ message: "Employee ID & password required" });
  }

  // ✔ FIXED: your MySQL column name is `empld`
  const sql = "SELECT * FROM Employees WHERE empld = ? LIMIT 1";

  pool.query(sql, [empId], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const user = result[0];

    // ✔ FIXED: compare with correct column
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid login" });
    }

    delete user.password;

    return res.json({
      success: true,
      employee: user,
    });
  });
};
