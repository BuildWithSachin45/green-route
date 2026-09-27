const express = require("express");

const {
  getUsers,
  toggleUserStatus,
  createUser,
} = require("../controllers/adminController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
);

router.post(
  "/users",
  protect,
  authorize("admin"),
  createUser
);

router.patch(
  "/users/:id/status",
  protect,
  authorize("admin"),
  toggleUserStatus
);

module.exports = router;