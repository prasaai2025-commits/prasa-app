const router = require("express").Router();
const { getProfile } = require("../controllers/employeeController");

router.get("/profile/:empId", getProfile);

module.exports = router;
