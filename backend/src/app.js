const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is healthy" }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
