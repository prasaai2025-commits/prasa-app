const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadBills");
const db = require("../db"); // your MySQL connection

router.post("/upload-bill", upload.single("bill"), async (req, res) => {
  try {
    const empId = req.body.empId;
    const fileName = req.file.filename;
    const filePath = req.file.path;

    const sql = `
        INSERT INTO Bills (empld, file_name, file_path, uploaded_at)
        VALUES (?, ?, ?, NOW())
    `;

    await db.promise().query(sql, [empId, fileName, filePath]);

    res.json({
      success: true,
      message: "Bill uploaded successfully",
      file: fileName
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
