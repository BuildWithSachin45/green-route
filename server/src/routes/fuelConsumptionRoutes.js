const express = require("express");

const {
  getFuelConsumptions,
  getActiveFuelConsumptions,
  createFuelConsumption,
  updateFuelConsumption,
  toggleFuelConsumptionStatus,
} = require("../controllers/fuelConsumptionController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.get(
  "/",
  protect,
  authorize("admin"),
  getFuelConsumptions
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createFuelConsumption
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFuelConsumption
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  toggleFuelConsumptionStatus
);

// User route
router.get(
  "/active",
  protect,
  authorize("user"),
  getActiveFuelConsumptions
);

module.exports = router;