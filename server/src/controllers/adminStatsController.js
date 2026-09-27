const User = require("../models/User");
const TransportMode = require("../models/TransportMode");
const FuelPrice = require("../models/FuelPrice");

// Get overall admin statistics
const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      activeUsers,
      totalTransportModes,
      activeTransportModes,
      totalFuelPrices,
      activeFuelPrices,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "admin",
      }),

      User.countDocuments({
        isActive: true,
      }),

      TransportMode.countDocuments(),

      TransportMode.countDocuments({
        isActive: true,
      }),

      FuelPrice.countDocuments(),

      FuelPrice.countDocuments({
        isActive: true,
      }),
    ]);

    res.json({
      success: true,

      stats: {
        totalUsers,
        totalAdmins,
        activeUsers,
        totalTransportModes,
        activeTransportModes,
        totalFuelPrices,
        activeFuelPrices,
      },
    });
  } catch (error) {
    console.error(
      "Get admin statistics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics",
    });
  }
};

module.exports = {
  getAdminStats,
};