const router = require("express").Router();
const { getHistory, getMonthlyReport } = require("../controllers/historyController");

router.get("/:empId", getHistory);
router.get("/monthly/:empId", getMonthlyReport);

module.exports = router;
