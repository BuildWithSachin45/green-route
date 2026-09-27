const User = require("../models/User");

// Get logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get user profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

module.exports = {
  getProfile,
};