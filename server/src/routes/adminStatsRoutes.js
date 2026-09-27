const express = require("express");

const {
  getAdminStats,
} = require("../controllers/adminStatsController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get admin statistics
router.get(
  "/",
  protect,
  authorize("admin"),
  getAdminStats
);

module.exports = router;