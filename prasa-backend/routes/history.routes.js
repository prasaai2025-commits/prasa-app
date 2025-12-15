const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:empld", async (req, res) => {
  const empld = req.params.empld;

  const [travel] = await db.query(
    "SELECT *, 'Travel' AS type FROM TravelExpenses WHERE empld=?",
    [empld]
  );

  const [ticket] = await db.query(
    "SELECT *, 'Ticket' AS type FROM TicketExpenses WHERE empld=?",
    [empld]
  );

  res.json([...travel, ...ticket]);
});

module.exports = router;
