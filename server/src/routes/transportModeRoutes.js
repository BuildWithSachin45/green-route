const express = require("express");

const {
  getTransportModes,
  createTransportMode,
  updateTransportMode,
  toggleTransportModeStatus,
} = require("../controllers/transportModeController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all transport modes - Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  getTransportModes
);

// Create transport mode - Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  createTransportMode
);

// Update transport mode - Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateTransportMode
);

// Activate / deactivate transport mode - Admin
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  toggleTransportModeStatus
);

module.exports = router;