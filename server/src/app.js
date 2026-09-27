const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const transportModeRoutes = require("./routes/transportModeRoutes");
const fuelPriceRoutes = require("./routes/fuelPriceRoutes");
const adminStatsRoutes = require("./routes/adminStatsRoutes");
const userRoutes = require("./routes/userRoutes");
const routeRoutes = require("./routes/routeRoutes");
const comparisonRoutes = require("./routes/comparisonRoutes");
const fuelConsumptionRoutes = require("./routes/fuelConsumptionRoutes");
const tripRoutes = require("./routes/tripRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GreenRoute API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/transport-modes", transportModeRoutes);
app.use("/api/admin/fuel-prices", fuelPriceRoutes);
app.use("/api/admin/stats", adminStatsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/routes", routeRoutes);
app.use("/api/user/comparison", comparisonRoutes);
app.use("/api/admin/fuel-consumption", fuelConsumptionRoutes);
app.use("/api/user/trips", tripRoutes);

module.exports = app;