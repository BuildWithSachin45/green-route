const express = require("express");

const {
  getProfile,
} = require("../controllers/userController");

const {
  getActiveTransportModes,
} = require("../controllers/transportModeController");

const {
  getActiveFuelPrices,
} = require("../controllers/fuelPriceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  getActiveFuelConsumptions,
} = require("../controllers/fuelConsumptionController");

const router = express.Router();

// =========================
// USER PROFILE
// =========================

router.get(
  "/profile",
  protect,
  authorize("user"),
  getProfile
);

// =========================
// ACTIVE TRANSPORT MODES
// =========================

router.get(
  "/transport-modes",
  protect,
  authorize("user"),
  getActiveTransportModes
);

// =========================
// ACTIVE FUEL PRICES
// =========================

router.get(
  "/fuel-prices",
  protect,
  authorize("user"),
  getActiveFuelPrices
);

router.get(
  "/fuel-consumption",
  protect,
  authorize("user"),
  getActiveFuelConsumptions
);

module.exports = router;