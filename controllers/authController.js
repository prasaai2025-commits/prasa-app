const pool = require("../config/db");

// LOGIN FUNCTION
exports.login = (req, res) => {
  const { empId, password } = req.body;

  if (!empId || !password) {
    return res.status(400).json({ message: "Employee ID and password required" });
  }

  const query = "SELECT * FROM Employees WHERE empId = ? LIMIT 1";

  pool.query(query, [empId], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    const user = results[0];

    // SIMPLE PASSWORD CHECK (plain-text)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    // ✅ FIXED SUCCESS RESPONSE (NO CRASH)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      employee: user
    });
  });
};
