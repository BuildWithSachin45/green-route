const FuelPrice = require("../models/FuelPrice");

// Get all fuel prices
const getFuelPrices = async (req, res) => {
  try {
    const fuelPrices = await FuelPrice.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      fuelPrices,
    });
  } catch (error) {
    console.error(
      "Get fuel prices error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel prices",
    });
  }
};


// =========================
// USER - GET ACTIVE FUEL PRICES
// =========================
const getActiveFuelPrices = async (req, res) => {
  try {
    const fuelPrices = await FuelPrice.find({
      isActive: true,
    }).sort({ fuelType: 1 });

    res.json({
      success: true,
      fuelPrices,
    });
  } catch (error) {
    console.error(
      "Get active fuel prices error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel prices",
    });
  }
};

// Add fuel price
const createFuelPrice = async (req, res) => {
  try {
    const {
      fuelType,
      pricePerUnit,
      unit,
    } = req.body;

    if (
      !fuelType ||
      pricePerUnit === undefined ||
      !unit
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Fuel type, price and unit are required",
      });
    }

    const existingFuelPrice =
      await FuelPrice.findOne({ fuelType });

    if (existingFuelPrice) {
      return res.status(400).json({
        success: false,
        message: "Fuel price already exists",
      });
    }

    const fuelPrice = await FuelPrice.create({
      fuelType,
      pricePerUnit,
      unit,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Fuel price created successfully",
      fuelPrice,
    });
  } catch (error) {
    console.error(
      "Create fuel price error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create fuel price",
    });
  }
};

// Update fuel price
const updateFuelPrice = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fuelType,
      pricePerUnit,
      unit,
    } = req.body;

    const fuelPrice =
      await FuelPrice.findById(id);

    if (!fuelPrice) {
      return res.status(404).json({
        success: false,
        message: "Fuel price not found",
      });
    }

    if (fuelType !== undefined) {
      fuelPrice.fuelType = fuelType;
    }

    if (pricePerUnit !== undefined) {
      fuelPrice.pricePerUnit = pricePerUnit;
    }

    if (unit !== undefined) {
      fuelPrice.unit = unit;
    }

    await fuelPrice.save();

    res.json({
      success: true,
      message: "Fuel price updated successfully",
      fuelPrice,
    });
  } catch (error) {
    console.error(
      "Update fuel price error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update fuel price",
    });
  }
};

// Activate / deactivate fuel price
const toggleFuelPriceStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const fuelPrice =
      await FuelPrice.findById(id);

    if (!fuelPrice) {
      return res.status(404).json({
        success: false,
        message: "Fuel price not found",
      });
    }

    fuelPrice.isActive =
      !fuelPrice.isActive;

    await fuelPrice.save();

    res.json({
      success: true,
      message: fuelPrice.isActive
        ? "Fuel price activated successfully"
        : "Fuel price deactivated successfully",
      fuelPrice,
    });
  } catch (error) {
    console.error(
      "Toggle fuel price status error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update fuel price status",
    });
  }
};

module.exports = {
  getFuelPrices,
  getActiveFuelPrices,
  createFuelPrice,
  updateFuelPrice,
  toggleFuelPriceStatus,
};