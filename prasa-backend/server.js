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

/* 🔐 CORS – allow frontend */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* BODY PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTES – ONE API */
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ticket-system", ticketRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.status(200).send("PRASA API running");
});

/* RENDER PORT */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
