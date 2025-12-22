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

/* ================================
   🔥 CORS CONFIG (WEB + ANDROID)
================================ */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://prasa-app.onrender.com",      // frontend if deployed
  "capacitor://localhost",               // Android APK
  "ionic://localhost",                   // Android WebView
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps & tools like Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 REQUIRED FOR PREFLIGHT (VERY IMPORTANT)
app.options("*", cors());

/* ================================
   BODY PARSERS
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   ROUTES (UNCHANGED)
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ticket-system", ticketRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("PRASA API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
