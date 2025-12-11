const router = require("express").Router();
const { addTravel } = require("../controllers/travelController");

router.post("/add", addTravel);

module.exports = router;
