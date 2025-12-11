const pool = require("../config/db.js")


exports.getProfile = (req, res) => {
  const empId = req.params.empId;

  pool.query("SELECT * FROM Employees WHERE empId = ?", [empId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    res.json(rows[0]);
  });
};
