const express = require("express");

const {
  register,
  login,
  createFirstAdmin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/create-first-admin", createFirstAdmin);

module.exports = router;