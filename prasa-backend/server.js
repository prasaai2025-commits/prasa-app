import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expenses.routes.js";
import ticketRoutes from "./routes/ticketSystem.routes.js";
import historyRoutes from "./routes/history.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

/* =========================
   ✅ GLOBAL OPEN CORS (SAFE)
   - fixes Android APK
   - fixes web frontend
   - fixes Postman
   - NO origin callback
========================= */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// also handle preflight properly
app.options("*", cors());

// BODY PARSERS
app.use(express.text({ type: "*/*", limit: "5mb" }));   // <-- Android safe
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ticket-system", ticketRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    message: "PRASA API running ✔",
    cors: "OPEN",
    version: "CORS-FIXED-FINAL",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CORS FIXED — Backend running on port ${PORT}`);
});
