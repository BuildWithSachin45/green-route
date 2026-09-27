const mongoose = require("mongoose");

const fuelConsumptionSchema = new mongoose.Schema(
  {
    transportMode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportMode",
      required: true,
      unique: true,
    },

    consumption: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
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
  "FuelConsumption",
  fuelConsumptionSchema
);