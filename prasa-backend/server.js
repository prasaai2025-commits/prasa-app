import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";
import ticketSystemRoutes from "./routes/ticketSystem.routes.js";
import adminRoutes from "./routes/admin.routes.js";   // ✅ ADMIN ROUTES ADDED

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

/* static files */
app.use("/uploads", express.static("uploads"));

/* 🟢 HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("PRASA Backend Running");
});

/* 🟢 API ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/ticket-system", ticketSystemRoutes);
app.use("/api/admin", adminRoutes);          // ✅ THIS LINE FIXES YOUR 404

/* ❗ fallback 404 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
