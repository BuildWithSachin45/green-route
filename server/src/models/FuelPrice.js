const mongoose = require("mongoose");

const fuelPriceSchema = new mongoose.Schema(
  {
    fuelType: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    pricePerUnit: {
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
  "FuelPrice",
  fuelPriceSchema
);