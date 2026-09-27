const express = require("express");

const {
  getFuelPrices,
  createFuelPrice,
  updateFuelPrice,
  toggleFuelPriceStatus,
} = require("../controllers/fuelPriceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all fuel prices
router.get(
  "/",
  protect,
  authorize("admin"),
  getFuelPrices
);

// Create fuel price
router.post(
  "/",
  protect,
  authorize("admin"),
  createFuelPrice
);

// Update fuel price
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFuelPrice
);

// Activate / deactivate fuel price
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  toggleFuelPriceStatus
);

module.exports = router;