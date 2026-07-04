/**
 * Himalayan Guest Experience Intelligence Platform
 * Express Server — Week 5: Database Integration
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/connection");

const analyzeRoutes = require("./routes/analyze");
const reviewRoutes  = require("./routes/reviews");
const statsRoutes   = require("./routes/stats");
const errorHandler  = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", methods: ["GET","POST","PUT","PATCH","DELETE"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", message: "Himalayan Platform API is running" }));

app.use("/api",         analyzeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/stats",   statsRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: "Route not found" }));
app.use(errorHandler);

(async () => {
  await connectDB();           // connect to DB before accepting requests
  app.listen(PORT, () => console.log(`🏔️  Server running on http://localhost:${PORT}`));
})();
