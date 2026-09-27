const FuelConsumption = require("../models/FuelConsumption");

const getFuelConsumptions = async (req, res) => {
  try {
    const consumptions =
      await FuelConsumption.find()
        .populate(
          "transportMode",
          "name category fuelType"
        )
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      consumptions,
    });
  } catch (error) {
    console.error(
      "Get fuel consumptions error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch fuel consumption data",
    });
  }
};

const getActiveFuelConsumptions = async (
  req,
  res
) => {
  try {
    const consumptions =
      await FuelConsumption.find({
        isActive: true,
      }).populate(
        "transportMode",
        "name category fuelType"
      );

    res.json({
      success: true,
      consumptions,
    });
  } catch (error) {
    console.error(
      "Get active fuel consumptions error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch active fuel consumption data",
    });
  }
};

const createFuelConsumption = async (
  req,
  res
) => {
  try {
    const {
      transportMode,
      consumption,
      unit,
    } = req.body;

    if (
      !transportMode ||
      consumption === undefined ||
      !unit
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Transport mode, consumption and unit are required",
      });
    }

    const existing =
      await FuelConsumption.findOne({
        transportMode,
      });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Fuel consumption already exists for this transport mode",
      });
    }

    const newConsumption =
      await FuelConsumption.create({
        transportMode,
        consumption,
        unit,
      });

    const populated =
      await FuelConsumption.findById(
        newConsumption._id
      ).populate(
        "transportMode",
        "name category fuelType"
      );

    res.status(201).json({
      success: true,
      message:
        "Fuel consumption added successfully",
      consumption: populated,
    });
  } catch (error) {
    console.error(
      "Create fuel consumption error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to add fuel consumption",
    });
  }
};

const updateFuelConsumption = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      transportMode,
      consumption,
      unit,
    } = req.body;

    const fuelConsumption =
      await FuelConsumption.findById(id);

    if (!fuelConsumption) {
      return res.status(404).json({
        success: false,
        message:
          "Fuel consumption not found",
      });
    }

    if (transportMode) {
      const existing =
        await FuelConsumption.findOne({
          transportMode,
          _id: { $ne: id },
        });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Fuel consumption already exists for this transport mode",
        });
      }

      fuelConsumption.transportMode =
        transportMode;
    }

    if (consumption !== undefined) {
      fuelConsumption.consumption =
        consumption;
    }

    if (unit) {
      fuelConsumption.unit = unit;
    }

    await fuelConsumption.save();

    const updated =
      await FuelConsumption.findById(id).populate(
        "transportMode",
        "name category fuelType"
      );

    res.json({
      success: true,
      message:
        "Fuel consumption updated successfully",
      consumption: updated,
    });
  } catch (error) {
    console.error(
      "Update fuel consumption error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update fuel consumption",
    });
  }
};

const toggleFuelConsumptionStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const fuelConsumption =
      await FuelConsumption.findById(id);

    if (!fuelConsumption) {
      return res.status(404).json({
        success: false,
        message:
          "Fuel consumption not found",
      });
    }

    fuelConsumption.isActive =
      !fuelConsumption.isActive;

    await fuelConsumption.save();

    res.json({
      success: true,
      message: `Fuel consumption ${
        fuelConsumption.isActive
          ? "activated"
          : "deactivated"
      } successfully`,
      consumption: fuelConsumption,
    });
  } catch (error) {
    console.error(
      "Toggle fuel consumption status error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update fuel consumption status",
    });
  }
};

module.exports = {
  getFuelConsumptions,
  getActiveFuelConsumptions,
  createFuelConsumption,
  updateFuelConsumption,
  toggleFuelConsumptionStatus,
};