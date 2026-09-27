const TransportMode = require("../models/TransportMode");

// =========================
// ADMIN - GET ALL MODES
// =========================

const getTransportModes = async (req, res) => {
  try {
    const transportModes = await TransportMode.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      transportModes,
    });
  } catch (error) {
    console.error(
      "Get transport modes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch transport modes",
    });
  }
};

// =========================
// USER - GET ACTIVE MODES
// =========================

const getActiveTransportModes = async (req, res) => {
  try {
    const transportModes = await TransportMode.find({
      isActive: true,
    }).sort({ name: 1 });

    res.json({
      success: true,
      transportModes,
    });
  } catch (error) {
    console.error(
      "Get active transport modes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch transport modes",
    });
  }
};

// =========================
// ADMIN - CREATE MODE
// =========================

const createTransportMode = async (req, res) => {
  try {
    const {
      name,
      category,
      fuelType,
      ticketFare,
      emissionFactor,
      ecoScore,
    } = req.body;

    if (
      !name ||
      !category ||
      emissionFactor === undefined ||
      ecoScore === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category, emission factor and Eco Score are required",
      });
    }

    const existingMode =
      await TransportMode.findOne({ name });

    if (existingMode) {
      return res.status(400).json({
        success: false,
        message: "Transport mode already exists",
      });
    }

    const transportMode =
      await TransportMode.create({
        name,
        category,
        fuelType: fuelType || "None",

        ticketFare:
          ticketFare !== undefined &&
          ticketFare !== ""
            ? Number(ticketFare)
            : 0,

        emissionFactor,
        ecoScore,
        isActive: true,
      });

    res.status(201).json({
      success: true,
      message: "Transport mode created successfully",
      transportMode,
    });
  } catch (error) {
    console.error(
      "Create transport mode error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create transport mode",
    });
  }
};

// =========================
// ADMIN - UPDATE MODE
// =========================

const updateTransportMode = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      fuelType,
      ticketFare,
      emissionFactor,
      ecoScore,
    } = req.body;

    const transportMode =
      await TransportMode.findById(id);

    if (!transportMode) {
      return res.status(404).json({
        success: false,
        message: "Transport mode not found",
      });
    }

    if (name !== undefined) {
      transportMode.name = name;
    }

    if (category !== undefined) {
      transportMode.category = category;
    }

    if (fuelType !== undefined) {
      transportMode.fuelType = fuelType;
    }

    // =========================
    // UPDATE TICKET FARE
    // =========================

    if (ticketFare !== undefined) {
      transportMode.ticketFare =
        ticketFare === ""
          ? 0
          : Number(ticketFare);
    }

    if (emissionFactor !== undefined) {
      transportMode.emissionFactor =
        emissionFactor;
    }

    if (ecoScore !== undefined) {
      transportMode.ecoScore = ecoScore;
    }

    await transportMode.save();

    res.json({
      success: true,
      message: "Transport mode updated successfully",
      transportMode,
    });
  } catch (error) {
    console.error(
      "Update transport mode error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update transport mode",
    });
  }
};

// =========================
// ADMIN - TOGGLE STATUS
// =========================

const toggleTransportModeStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const transportMode =
      await TransportMode.findById(id);

    if (!transportMode) {
      return res.status(404).json({
        success: false,
        message: "Transport mode not found",
      });
    }

    transportMode.isActive =
      !transportMode.isActive;

    await transportMode.save();

    res.json({
      success: true,
      message: transportMode.isActive
        ? "Transport mode activated successfully"
        : "Transport mode deactivated successfully",
      transportMode,
    });
  } catch (error) {
    console.error(
      "Toggle transport mode status error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update transport mode status",
    });
  }
};

// =========================
// EXPORTS
// =========================

module.exports = {
  getTransportModes,
  getActiveTransportModes,
  createTransportMode,
  updateTransportMode,
  toggleTransportModeStatus,
};