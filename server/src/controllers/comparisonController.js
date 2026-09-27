const TransportMode = require("../models/TransportMode");
const FuelPrice = require("../models/FuelPrice");

const {
  calculateCost,
  calculateCO2,
  calculateEcoScore,
} = require("../services/calculationService");

// =========================
// COMPARE TRANSPORT MODES
// =========================
const compareTransportModes = async (req, res) => {
  try {
    const { distanceKm } = req.body;

    // =========================
    // VALIDATE DISTANCE
    // =========================
    if (
      distanceKm === undefined ||
      distanceKm === null ||
      !Number.isFinite(Number(distanceKm)) ||
      Number(distanceKm) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid distance is required",
      });
    }

    const distance = Number(distanceKm);

    // =========================
    // GET ACTIVE TRANSPORT MODES
    // =========================
    const transportModes =
      await TransportMode.find({
        isActive: true,
      }).sort({
        name: 1,
      });

    // =========================
    // GET ACTIVE FUEL PRICES
    // =========================
    const fuelPrices =
      await FuelPrice.find({
        isActive: true,
      });

    // =========================
    // CREATE FUEL PRICE LOOKUP
    // =========================
    const fuelPriceMap = {};

    fuelPrices.forEach((fuelPrice) => {
      fuelPriceMap[
        fuelPrice.fuelType.toLowerCase()
      ] = fuelPrice;
    });

    // =========================
    // CALCULATE EACH MODE
    // =========================
    const comparisons =
      transportModes.map((mode) => {
        const fuelPrice =
          fuelPriceMap[
            mode.fuelType.toLowerCase()
          ] || null;

        const cost = calculateCost(
          distance,
          mode,
          fuelPrice
        );

        const co2 = calculateCO2(
          distance,
          mode
        );

        const ecoScore =
          calculateEcoScore(mode);

        const fuelUsed =
          mode.fuelConsumption > 0
            ? Number(
                (
                  (distance *
                    mode.fuelConsumption) /
                  100
                ).toFixed(2)
              )
            : 0;

        return {
          transportModeId: mode._id,
          name: mode.name,
          category: mode.category,
          fuelType: mode.fuelType,

          distanceKm: distance,

          fuelConsumption:
            mode.fuelConsumption,

          fuelUsed,

          cost,

          co2Kg: co2,

          ecoScore,

          emissionFactor:
            mode.emissionFactor,
        };
      });

    // =========================
    // SEND RESULT
    // =========================
    res.json({
      success: true,

      distanceKm: distance,

      comparisons,
    });
  } catch (error) {
    console.error(
      "Transport comparison error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to compare transport modes",
    });
  }
};

module.exports = {
  compareTransportModes,
};