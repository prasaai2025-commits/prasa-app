require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const travelRoutes = require("./routes/travel.routes");
const ticketRoutes = require("./routes/ticket.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();

/* ✅ CORS – frontend → backend */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3003",
    "http://localhost:3004",
    "https://prasa-app-yde3.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

/* ✅ ONE API */
app.use("/api/auth", authRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/history", historyRoutes);

/* Health check */
app.get("/", (req, res) => {
  res.send("PRASA API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
