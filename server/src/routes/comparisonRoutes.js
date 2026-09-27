const express = require("express");

const {
  compareTransportModes,
} = require("../controllers/comparisonController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// COMPARE TRANSPORT MODES
// =========================
router.post(
  "/",
  protect,
  authorize("user"),
  compareTransportModes
);

module.exports = router;