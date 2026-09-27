const mongoose = require("mongoose");

const transportModeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    fuelType: {
      type: String,
      default: "None",
      trim: true,
    },

    // =========================
    // PRESET TICKET FARE
    // =========================
    // Used mainly for public transport
    // such as Bus, Train, Metro, etc.
    ticketFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    emissionFactor: {
      type: Number,
      required: true,
      min: 0,
    },

    ecoScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TransportMode",
  transportModeSchema
);