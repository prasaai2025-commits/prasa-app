const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/", (req, res) => {
  const action = req.body.action;

  switch (action) {
    case "login":
      return authController.login(req, res);

    default:
      return res.status(400).json({ message: "Unknown action" });
  }
});

module.exports = router;
