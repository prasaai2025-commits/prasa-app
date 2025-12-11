const pool = require("../config/db.js")

const path = require("path");

exports.uploadBill = (req, res) => {
  const empId = req.body.empId;
  const filePath = "/uploads/bills/" + req.file.filename;

  pool.query(
    "INSERT INTO Bills (empId, filePath, uploadDate) VALUES (?, ?, NOW())",
    [empId, filePath],
    (err) => {
      if (err) return res.status(500).json({ message: "DB Error" });

      res.json({ success: true, filePath });
    }
  );
};
