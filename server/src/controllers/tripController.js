const Trip = require("../models/Trip");

// =========================
// SAVE TRIP
// =========================

const saveTrip = async (req, res) => {
  try {
    const {
      start,
      destination,
      distanceKm,
      durationMinutes,
      transportMode,
      transportModeName,
      fuelType,
      fuelUsed,
      fuelUnit,
      tripCost,
      co2Emission,
      ecoScore,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (
      !start ||
      !start.name ||
      start.latitude === undefined ||
      start.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid starting location is required",
      });
    }

    if (
      !destination ||
      !destination.name ||
      destination.latitude === undefined ||
      destination.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid destination is required",
      });
    }

    if (
      distanceKm === undefined ||
      durationMinutes === undefined ||
      !transportMode ||
      !transportModeName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Route, transport mode and calculation details are required",
      });
    }

    // =========================
    // CREATE TRIP
    // =========================

    const trip = await Trip.create({
      user: req.user.id,

      start: {
        name: start.name,
        latitude: Number(start.latitude),
        longitude: Number(start.longitude),
      },

      destination: {
        name: destination.name,
        latitude: Number(destination.latitude),
        longitude: Number(destination.longitude),
      },

      distanceKm: Number(distanceKm),

      durationMinutes: Number(durationMinutes),

      transportMode,

      transportModeName,

      fuelType: fuelType || "None",

      fuelUsed:
        fuelUsed !== undefined
          ? Number(fuelUsed)
          : 0,

      fuelUnit: fuelUnit || "",

      tripCost:
        tripCost !== undefined
          ? Number(tripCost)
          : 0,

      co2Emission:
        co2Emission !== undefined
          ? Number(co2Emission)
          : 0,

      ecoScore:
        ecoScore !== undefined
          ? Number(ecoScore)
          : 0,
    });

    res.status(201).json({
      success: true,
      message: "Trip saved successfully",
      trip,
    });
  } catch (error) {
    console.error("Save trip error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save trip",
    });
  }
};

// =========================
// GET MY TRIPS
// =========================

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user.id,
    })
      .populate(
        "transportMode",
        "name category fuelType"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      trips,
    });
  } catch (error) {
    console.error("Get trips error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trips",
    });
  }
};

// =========================
// DELETE MY TRIP
// =========================

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    await trip.deleteOne();

    res.json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete trip",
    });
  }
};

module.exports = {
  saveTrip,
  getMyTrips,
  deleteTrip,
};