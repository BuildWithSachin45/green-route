const axios = require("axios");

const TransportMode = require("../models/TransportMode");
const FuelPrice = require("../models/FuelPrice");
const FuelConsumption = require("../models/FuelConsumption");

const {
  getRoute,
} = require("../services/routeService");

// =========================
// LOCATION SEARCH
// =========================

const searchLocations = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        locations: [],
      });
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: q.trim(),
          format: "json",
          limit: 10,
          addressdetails: 1,
          "accept-language": "en",
        },
        headers: {
          "User-Agent":
            "GreenRoute-MiniProject/1.0",
        },
      }
    );

    const locations = response.data.map(
      (location) => ({
        name: location.display_name,
        latitude: Number(location.lat),
        longitude: Number(location.lon),
        type: location.type || "",
        category: location.category || "",
        osmType: location.osm_type || "",
        osmId: location.osm_id || null,
      })
    );

    res.json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error(
      "Location search error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to search locations",
    });
  }
};

// =========================
// CALCULATE ROUTE
// =========================

const calculateRoute = async (req, res) => {
  try {
    const {
      start,
      destination,
    } = req.body;

    // -------------------------
    // Validate locations
    // -------------------------

    if (
      !start ||
      start.latitude === undefined ||
      start.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid starting location coordinates are required",
      });
    }

    if (
      !destination ||
      destination.latitude === undefined ||
      destination.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid destination location coordinates are required",
      });
    }

    const startLatitude =
      Number(start.latitude);

    const startLongitude =
      Number(start.longitude);

    const destinationLatitude =
      Number(destination.latitude);

    const destinationLongitude =
      Number(destination.longitude);

    if (
      !Number.isFinite(startLatitude) ||
      !Number.isFinite(startLongitude) ||
      !Number.isFinite(destinationLatitude) ||
      !Number.isFinite(destinationLongitude)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid location coordinates",
      });
    }

    if (
      startLatitude === destinationLatitude &&
      startLongitude === destinationLongitude
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Starting location and destination cannot be the same",
      });
    }

    // -------------------------
    // Get road route
    // -------------------------

    const route = await getRoute(
      startLongitude,
      startLatitude,
      destinationLongitude,
      destinationLatitude
    );

    res.json({
      success: true,

      start: {
        name:
          start.name ||
          "Starting Location",
        latitude: startLatitude,
        longitude: startLongitude,
      },

      destination: {
        name:
          destination.name ||
          "Destination",
        latitude:
          destinationLatitude,
        longitude:
          destinationLongitude,
      },

      distanceKm:
        route.distanceKm,

      durationMinutes:
        route.durationMinutes,

      routeCoordinates:
        route.routeCoordinates,
    });
  } catch (error) {
    console.error(
      "Calculate route error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to calculate route",
    });
  }
};

// =========================
// CALCULATE TRIP COST
// =========================

const calculateTripCost = async (
  req,
  res
) => {
  try {
    const {
      distanceKm,
      transportModeId,
    } = req.body;

    // -------------------------
    // Validate input
    // -------------------------

    if (
      distanceKm === undefined ||
      !transportModeId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Distance and transport mode are required",
      });
    }

    const distance =
      Number(distanceKm);

    if (
      !Number.isFinite(distance) ||
      distance <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Distance must be greater than 0",
      });
    }

    // -------------------------
    // Get transport mode
    // -------------------------

    const transportMode =
      await TransportMode.findOne({
        _id: transportModeId,
        isActive: true,
      });

    if (!transportMode) {
      return res.status(404).json({
        success: false,
        message:
          "Active transport mode not found",
      });
    }

    // =========================
    // PUBLIC TRANSPORT
    // =========================
    //
    // Bus / Train / Metro etc.
    // use the preset ticket fare.
    //
    // The fare is for the complete trip,
    // so distance does NOT multiply the fare.
    // =========================

    if (
      transportMode.ticketFare !== undefined &&
      transportMode.ticketFare !== null &&
      Number(transportMode.ticketFare) > 0
    ) {
      const ticketFare =
        Number(transportMode.ticketFare);

      const co2Emission =
        distance *
        Number(
          transportMode.emissionFactor
        );

      return res.json({
        success: true,

        calculation: {
          transportMode: {
            id: transportMode._id,
            name: transportMode.name,
            category:
              transportMode.category,
            fuelType:
              transportMode.fuelType,
          },

          distanceKm: Number(
            distance.toFixed(2)
          ),

          consumption: 0,

          consumptionUnit: "",

          fuelUsed: 0,

          fuelPrice: 0,

          fuelPriceUnit: null,

          tripCost: Number(
            ticketFare.toFixed(2)
          ),

          ticketFare: Number(
            ticketFare.toFixed(2)
          ),

          emissionFactor: Number(
            Number(
              transportMode.emissionFactor
            ).toFixed(2)
          ),

          co2Emission: Number(
            (co2Emission / 1000).toFixed(2)
          ),

          ecoScore:
            transportMode.ecoScore,
        },
      });
    }

    // =========================
    // NON-FUEL TRANSPORT
    // =========================
    //
    // Walking / Cycling etc.
    // =========================

    if (
      !transportMode.fuelType ||
      transportMode.fuelType === "None"
    ) {
      const co2Emission =
        distance *
        Number(
          transportMode.emissionFactor
        );

      return res.json({
        success: true,

        calculation: {
          transportMode: {
            id: transportMode._id,
            name: transportMode.name,
            category:
              transportMode.category,
            fuelType:
              transportMode.fuelType,
          },

          distanceKm: Number(
            distance.toFixed(2)
          ),

          consumption: 0,

          consumptionUnit: "",

          fuelUsed: 0,

          fuelPrice: 0,

          fuelPriceUnit: null,

          tripCost: 0,

          ticketFare: 0,

          emissionFactor: Number(
            Number(
              transportMode.emissionFactor
            ).toFixed(2)
          ),

          co2Emission: Number(
            (co2Emission / 1000).toFixed(2)
          ),

          ecoScore:
            transportMode.ecoScore,
        },
      });
    }

    // =========================
    // FUEL-BASED TRANSPORT
    // =========================

    const fuelConsumption =
      await FuelConsumption.findOne({
        transportMode:
          transportModeId,
        isActive: true,
      });

    if (!fuelConsumption) {
      return res.status(404).json({
        success: false,
        message:
          "Fuel consumption data not found for this transport mode",
      });
    }

    const consumption =
      Number(
        fuelConsumption.consumption
      );

    if (
      !Number.isFinite(consumption) ||
      consumption <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid fuel consumption value",
      });
    }

    // -------------------------
    // Get fuel price
    // -------------------------

    const fuelPrice =
      await FuelPrice.findOne({
        fuelType:
          transportMode.fuelType,
        isActive: true,
      });

    if (!fuelPrice) {
      return res.status(404).json({
        success: false,
        message:
          "Fuel price not found for this transport mode",
      });
    }

    // -------------------------
    // Calculate fuel used
    // -------------------------

    const fuelUsed =
      (distance * consumption) / 100;

    // -------------------------
    // Calculate trip cost
    // -------------------------

    const tripCost =
      fuelUsed *
      Number(
        fuelPrice.pricePerUnit
      );

    // -------------------------
    // Calculate CO2
    // -------------------------

    const co2Emission =
      distance *
      Number(
        transportMode.emissionFactor
      );

    // -------------------------
    // Response
    // -------------------------

    res.json({
      success: true,

      calculation: {
        transportMode: {
          id: transportMode._id,
          name: transportMode.name,
          category:
            transportMode.category,
          fuelType:
            transportMode.fuelType,
        },

        distanceKm: Number(
          distance.toFixed(2)
        ),

        consumption: Number(
          consumption.toFixed(2)
        ),

        consumptionUnit:
          fuelConsumption.unit,

        fuelUsed: Number(
          fuelUsed.toFixed(2)
        ),

        fuelPrice: Number(
          fuelPrice.pricePerUnit.toFixed(2)
        ),

        fuelPriceUnit:
          fuelPrice.unit,

        tripCost: Number(
          tripCost.toFixed(2)
        ),

        ticketFare: 0,

        emissionFactor: Number(
          Number(
            transportMode.emissionFactor
          ).toFixed(2)
        ),

        co2Emission: Number(
          (co2Emission / 1000).toFixed(2)
        ),

        ecoScore:
          transportMode.ecoScore,
      },
    });
  } catch (error) {
    console.error(
      "Trip cost calculation error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to calculate trip cost",
    });
  }
};

module.exports = {
  searchLocations,
  calculateRoute,
  calculateTripCost,
};