// routes/authRoutes.js
const router = require("express").Router();
const { login } = require("../controllers/authController");

// ✔ FINAL AND CORRECT ROUTE
// This creates: POST /api/auth/login
router.post("/login", login);

module.exports = router;
