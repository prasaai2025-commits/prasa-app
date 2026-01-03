import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expenses.routes.js";
import ticketRoutes from "./routes/ticketSystem.routes.js";
import historyRoutes from "./routes/history.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

/* ============================
   ABSOLUTELY REQUIRED PARSERS
============================ */
// Handles JSON
app.use(bodyParser.json());
app.use(express.json());

// Handles forms (mobile, axios, fetch variations)
app.use(express.urlencoded({ extended: true }));

// Extra fallback (in case Render sends as text)
app.use(express.text({ type: "application/json" }));

/* ============================
   CORS
============================ */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* ============================
   ROUTES
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ticket-system", ticketRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

/* ============================
   HEALTH CHECK
============================ */
app.get("/", (req, res) => {
  res.json({ message: "PRASA API running ✔" });
});

/* ============================
   START SERVER
============================ */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Backend running on port", PORT);
});
