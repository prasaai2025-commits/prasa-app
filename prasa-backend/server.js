import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import pool from "./db.js";

dotenv.config();

const app = express();

// Required for Render / JSON body issues
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS FIX
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// health check
app.get("/", (req, res) => {
  res.send("PRASA Backend Running");
});

// MAIN ROUTE
app.use("/api/auth", authRoutes);

// DB connect log only
pool
  .getConnection()
  .then(() => console.log("✅ MySQL Connected"))
  .catch((err) => console.error("❌ DB ERROR", err));

// Render PORT support
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
