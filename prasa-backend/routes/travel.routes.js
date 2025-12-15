const express = require("express");
const router = express.Router();
const db = require("../db");

/* Add travel expense */
router.post("/", async (req, res) => {
  const { empld, travel_date, from, to, purpose, mode, amount } = req.body;

  await db.query(
    `INSERT INTO TravelExpenses
    (empld, travel_date, location_from, location_to, purpose, mode_of_travel, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [empld, travel_date, from, to, purpose, mode, amount]
  );

  res.json({ success: true });
});

/* Get travel expenses */
router.get("/:empld", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM TravelExpenses WHERE empld=? ORDER BY id DESC",
    [req.params.empld]
  );
  res.json(rows);
});

module.exports = router;
