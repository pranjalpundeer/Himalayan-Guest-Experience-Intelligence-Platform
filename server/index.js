require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db/connection");
const passport = require("./passport");

const analyzeRoutes = require("./routes/analyze");
const reviewRoutes  = require("./routes/reviews");
const statsRoutes   = require("./routes/stats");
const authRoutes    = require("./routes/auth");
const errorHandler  = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, cb) => cb(null, true),
  methods: ["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/health", (req, res) => res.json({ status: "ok", message: "Himalayan Platform API is running" }));

app.use("/api/auth",    authRoutes);
app.use("/api",         analyzeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/stats",   statsRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: "Route not found" }));
app.use(errorHandler);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🏔️  Server running on http://localhost:${PORT}`));
})();
