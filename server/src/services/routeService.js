const axios = require("axios");

// =========================
// GET ROUTE FROM OSRM
// =========================
const getRoute = async (
  startLongitude,
  startLatitude,
  endLongitude,
  endLatitude
) => {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${startLongitude},${startLatitude};` +
      `${endLongitude},${endLatitude}`;

    const response = await axios.get(url, {
      params: {
        overview: "full",
        geometries: "geojson",
        steps: true,
      },
    });

    // =========================
    // VALIDATE OSRM RESPONSE
    // =========================
    if (
      !response.data ||
      response.data.code !== "Ok" ||
      !response.data.routes?.length
    ) {
      throw new Error(
        "Route could not be found"
      );
    }

    const route = response.data.routes[0];

    // =========================
    // GET ROUTE COORDINATES
    // =========================
    const coordinates =
      route.geometry?.coordinates || [];

    // OSRM format:
    // [longitude, latitude]
    //
    // Leaflet format:
    // [latitude, longitude]

    const routeCoordinates =
      coordinates.map(
        ([longitude, latitude]) => [
          latitude,
          longitude,
        ]
      );

    // =========================
    // RETURN ROUTE INFORMATION
    // =========================
    return {
      // Distance in kilometers
      distanceKm: Number(
        (route.distance / 1000).toFixed(2)
      ),

      // Duration in minutes
      durationMinutes: Number(
        (route.duration / 60).toFixed(1)
      ),

      // Raw OSRM duration in seconds
      rawDurationSeconds:
        route.duration,

      // Actual road route
      routeCoordinates,
    };
  } catch (error) {
    console.error(
      "OSRM route service error:",
      error.message
    );

    throw new Error(
      "Unable to calculate route"
    );
  }
};

module.exports = {
  getRoute,
};