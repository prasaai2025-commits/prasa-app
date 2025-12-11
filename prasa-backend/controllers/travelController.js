const pool = require("../config/db.js")


exports.addTravel = (req, res) => {
  const { empId, date, amount, description } = req.body;

  const sql = "INSERT INTO Travel (empId, date, amount, description) VALUES (?, ?, ?, ?)";

  pool.query(sql, [empId, date, amount, description], (err) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json({ success: true, message: "Travel expense added" });
  });
};
