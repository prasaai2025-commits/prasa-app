const pool = require("../config/db.js")


exports.getHistory = (req, res) => {
  const empId = req.params.empId;

  const sql = `
    SELECT 'travel' AS type, date, amount, description 
    FROM Travel WHERE empId = ?
    UNION ALL
    SELECT 'ticket', date, amount, type 
    FROM Tickets WHERE empId = ?
  `;

  pool.query(sql, [empId, empId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json(rows);
  });
};

exports.getMonthlyReport = (req, res) => {
  const empId = req.params.empId;

  const sql = `
    SELECT 
      MONTH(date) AS month, 
      SUM(amount) AS total 
    FROM Travel 
    WHERE empId = ?
    GROUP BY MONTH(date)
  `;

  pool.query(sql, [empId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json(rows);
  });
};
