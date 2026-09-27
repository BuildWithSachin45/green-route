const express = require("express");

const {
  saveTrip,
  getMyTrips,
  deleteTrip,
} = require("../controllers/tripController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// SAVE TRIP
// =========================

router.post(
  "/",
  protect,
  authorize("user"),
  saveTrip
);

// =========================
// GET MY TRIPS
// =========================

router.get(
  "/",
  protect,
  authorize("user"),
  getMyTrips
);

// =========================
// DELETE MY TRIP
// =========================

router.delete(
  "/:id",
  protect,
  authorize("user"),
  deleteTrip
);

module.exports = router;