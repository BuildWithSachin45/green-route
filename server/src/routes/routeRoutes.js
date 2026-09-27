const express = require("express");

const {
  calculateRoute,
  searchLocations,
  calculateTripCost,
} = require("../controllers/routeController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Search locations
router.get(
  "/search",
  protect,
  authorize("user"),
  searchLocations
);

// Calculate road route
router.post(
  "/calculate",
  protect,
  authorize("user"),
  calculateRoute
);

// Calculate trip cost
router.post(
  "/calculate-cost",
  protect,
  authorize("user"),
  calculateTripCost
);

module.exports = router;