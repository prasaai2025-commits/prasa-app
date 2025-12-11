// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root test
app.get("/", (req, res) => {
  res.json({ message: "PRASA API Running", time: new Date().toISOString() });
});

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/app/travel", require("./routes/travelRoutes"));
app.use("/api/app/ticket", require("./routes/ticketRoutes"));
app.use("/api/bills", require("./routes/billsRoutes"));
app.use("/api/app/history", require("./routes/historyRoutes"));
app.use("/api/app/reports", require("./routes/reportsRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// FINAL FIX — Render-Required PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🔥 PRASA API running on PORT = ${PORT}`);
});
