const express = require("express");
const router = express.Router();
const db = require("../db");

/* Add ticket expense */
router.post("/", async (req, res) => {
  const { empld, ticket_date, purpose, assigned_to, amount } = req.body;

  await db.query(
    `INSERT INTO TicketExpenses
    (empld, ticket_date, purpose, assigned_to, amount)
    VALUES (?, ?, ?, ?, ?)`,
    [empld, ticket_date, purpose, assigned_to, amount]
  );

  res.json({ success: true });
});

/* Get ticket expenses */
router.get("/:empld", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM TicketExpenses WHERE empld=? ORDER BY id DESC",
    [req.params.empld]
  );
  res.json(rows);
});

module.exports = router;
