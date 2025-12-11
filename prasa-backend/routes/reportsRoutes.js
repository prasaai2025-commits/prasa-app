const router = require("express").Router();
const { getMonthlyReport } = require("../controllers/historyController");

router.get("/monthly/:empId", getMonthlyReport);

module.exports = router;
