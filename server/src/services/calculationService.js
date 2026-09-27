const calculateFuelConsumption = (
  distanceKm,
  fuelConsumption
) => {
  if (!fuelConsumption || fuelConsumption <= 0) {
    return 0;
  }

  return (
    (distanceKm * fuelConsumption) / 100
  );
};

// =========================
// CALCULATE TRAVEL COST
// =========================

const calculateCost = (
  distanceKm,
  transportMode,
  fuelPrice
) => {
  // =========================
  // PUBLIC TRANSPORT / TICKET FARE
  // =========================

  if (
    transportMode.ticketFare !== undefined &&
    transportMode.ticketFare !== null
  ) {
    return Number(
      Number(transportMode.ticketFare).toFixed(2)
    );
  }

  // =========================
  // NON-FUEL MODE
  // =========================

  if (
    !transportMode.fuelType ||
    transportMode.fuelType === "None"
  ) {
    return 0;
  }

  // =========================
  // FUEL-BASED TRANSPORT
  // =========================

  if (!fuelPrice) {
    return 0;
  }

  /*
    fuelConsumption means:
    litres / units per 100 km
  */

  const fuelUsed = calculateFuelConsumption(
    distanceKm,
    transportMode.fuelConsumption
  );

  return Number(
    (fuelUsed * fuelPrice.pricePerUnit).toFixed(2)
  );
};

// =========================
// CALCULATE CO2
// =========================

const calculateCO2 = (
  distanceKm,
  transportMode
) => {
  /*
    emissionFactor:
    grams of CO2 per km
  */

  const co2Grams =
    distanceKm *
    transportMode.emissionFactor;

  return Number(
    (co2Grams / 1000).toFixed(2)
  );
};

// =========================
// GET ECO SCORE
// =========================

const calculateEcoScore = (
  transportMode
) => {
  return transportMode.ecoScore;
};

module.exports = {
  calculateCost,
  calculateCO2,
  calculateEcoScore,
};