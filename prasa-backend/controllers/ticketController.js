const pool = require("../config/db.js")


exports.addTicket = (req, res) => {
  const { empId, date, amount, type } = req.body;

  pool.query(
    "INSERT INTO Tickets (empId, date, amount, type) VALUES (?, ?, ?, ?)",
    [empId, date, amount, type],
    (err) => {
      if (err) return res.status(500).json({ message: "DB Error" });

      res.json({ success: true, message: "Ticket expense added" });
    }
  );
};
