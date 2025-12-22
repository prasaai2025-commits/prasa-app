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
   🔥 CORS CONFIG (CRITICAL)
   Works for:
   - localhost (web)
   - Render frontend
   - Android APK (no origin)
========================= */
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (Android APK, Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://prasa-api.onrender.com",
      // add frontend URL here if deployed later
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔥 handle preflight

// BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES (UNCHANGED)
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ticket-system", ticketRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("PRASA API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
