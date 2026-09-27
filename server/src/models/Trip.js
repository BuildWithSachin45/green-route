const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    start: {
      name: {
        type: String,
        required: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    destination: {
      name: {
        type: String,
        required: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    distanceKm: {
      type: Number,
      required: true,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    transportMode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportMode",
      required: true,
    },

    transportModeName: {
      type: String,
      required: true,
    },

    fuelType: {
      type: String,
      default: "None",
    },

    fuelUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    fuelUnit: {
      type: String,
      default: "",
    },

    tripCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    co2Emission: {
      type: Number,
      default: 0,
      min: 0,
    },

    ecoScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);