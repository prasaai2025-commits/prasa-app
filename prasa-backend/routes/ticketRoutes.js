const router = require("express").Router();
const { addTicket } = require("../controllers/ticketController");

router.post("/add", addTicket);

module.exports = router;
