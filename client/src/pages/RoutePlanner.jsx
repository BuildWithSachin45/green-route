import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RoutePlanner() {
  const navigate = useNavigate();

  // =========================
  // LOCATION STATES
  // =========================

  const [startQuery, setStartQuery] = useState("");
  const [destinationQuery, setDestinationQuery] =
    useState("");

  const [startSuggestions, setStartSuggestions] =
    useState([]);

  const [
    destinationSuggestions,
    setDestinationSuggestions,
  ] = useState([]);

  const [startLocation, setStartLocation] =
    useState(null);

  const [
    destinationLocation,
    setDestinationLocation,
  ] = useState(null);

  // =========================
  // ROUTE STATES
  // =========================

  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] =
    useState(false);

  // =========================
  // TRANSPORT STATES
  // =========================

  const [transportModes, setTransportModes] =
    useState([]);

  const [
    selectedTransportMode,
    setSelectedTransportMode,
  ] = useState("");

  // =========================
  // CALCULATION STATES
  // =========================

  const [calculation, setCalculation] =
    useState(null);

  const [calculationLoading, setCalculationLoading] =
    useState(false);

  // =========================
  // COMPARISON STATES
  // =========================

  const [comparisons, setComparisons] =
    useState([]);

  const [comparisonLoading, setComparisonLoading] =
    useState(false);

  // =========================
  // SAVE TRIP STATES
  // =========================

  const [saveLoading, setSaveLoading] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  // =========================
  // COMMON STATES
  // =========================

  const [error, setError] = useState("");

  // =========================
  // FETCH TRANSPORT MODES
  // =========================

  useEffect(() => {
    const fetchTransportModes = async () => {
      try {
        const response = await api.get(
          "/api/user/transport-modes"
        );

        setTransportModes(
          response.data.transportModes || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch transport modes:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load transport modes."
        );
      }
    };

    fetchTransportModes();
  }, [navigate]);

  // =========================
  // START LOCATION SEARCH
  // =========================

  useEffect(() => {
    if (
      !startQuery ||
      startQuery.trim().length < 2
    ) {
      setStartSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await api.get(
          "/api/user/routes/search",
          {
            params: {
              q: startQuery,
            },
          }
        );

        setStartSuggestions(
          response.data.locations || []
        );
      } catch (error) {
        console.error(
          "Start location search error:",
          error
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [startQuery]);

  // =========================
  // DESTINATION SEARCH
  // =========================

  useEffect(() => {
    if (
      !destinationQuery ||
      destinationQuery.trim().length < 2
    ) {
      setDestinationSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await api.get(
          "/api/user/routes/search",
          {
            params: {
              q: destinationQuery,
            },
          }
        );

        setDestinationSuggestions(
          response.data.locations || []
        );
      } catch (error) {
        console.error(
          "Destination location search error:",
          error
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [destinationQuery]);

  // =========================
  // SELECT START LOCATION
  // =========================

  const handleSelectStart = (location) => {
    setStartLocation(location);
    setStartQuery(location.name);
    setStartSuggestions([]);

    setRoute(null);
    setCalculation(null);
    setComparisons([]);
    setSaveMessage("");
  };

  // =========================
  // SELECT DESTINATION
  // =========================

  const handleSelectDestination = (location) => {
    setDestinationLocation(location);
    setDestinationQuery(location.name);
    setDestinationSuggestions([]);

    setRoute(null);
    setCalculation(null);
    setComparisons([]);
    setSaveMessage("");
  };

  // =========================
  // CALCULATE ROUTE
  // =========================

  const handleCalculateRoute = async () => {
    setError("");
    setSaveMessage("");
    setRoute(null);
    setCalculation(null);
    setComparisons([]);

    if (!startLocation) {
      setError(
        "Please select a starting location from the suggestions."
      );
      return;
    }

    if (!destinationLocation) {
      setError(
        "Please select a destination from the suggestions."
      );
      return;
    }

    if (
      startLocation.latitude ===
        destinationLocation.latitude &&
      startLocation.longitude ===
        destinationLocation.longitude
    ) {
      setError(
        "Starting location and destination cannot be the same."
      );
      return;
    }

    try {
      setRouteLoading(true);

      const response = await api.post(
        "/api/user/routes/calculate",
        {
          start: {
            name: startLocation.name,
            latitude: startLocation.latitude,
            longitude: startLocation.longitude,
          },

          destination: {
            name: destinationLocation.name,
            latitude:
              destinationLocation.latitude,
            longitude:
              destinationLocation.longitude,
          },
        }
      );

      setRoute(response.data);
    } catch (error) {
      console.error(
        "Route calculation error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to calculate route."
      );
    } finally {
      setRouteLoading(false);
    }
  };

  // =========================
  // SELECT TRANSPORT MODE
  // =========================

  const handleTransportModeChange = (event) => {
    const modeId = event.target.value;

    setSelectedTransportMode(modeId);
    setCalculation(null);
    setSaveMessage("");
  };

  // =========================
  // CALCULATE TRIP COST
  // =========================

  const handleCalculateCost = async () => {
    setError("");
    setSaveMessage("");

    if (!route) {
      setError(
        "Please calculate the route first."
      );
      return;
    }

    if (!selectedTransportMode) {
      setError(
        "Please select a transport mode."
      );
      return;
    }

    try {
      setCalculationLoading(true);

      const response = await api.post(
        "/api/user/routes/calculate-cost",
        {
          distanceKm: route.distanceKm,
          transportModeId:
            selectedTransportMode,
        }
      );

      setCalculation(
        response.data.calculation
      );
    } catch (error) {
      console.error(
        "Trip calculation error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to calculate trip cost."
      );
    } finally {
      setCalculationLoading(false);
    }
  };

  // =========================
  // COMPARE TRANSPORT MODES
  // =========================

  const handleCompareTransportModes =
    async () => {
      setError("");
      setComparisons([]);

      if (!route) {
        setError(
          "Please calculate the route first."
        );
        return;
      }

      try {
        setComparisonLoading(true);

        const response = await api.post(
          "/api/user/comparison",
          {
            distanceKm: route.distanceKm,
          }
        );

        setComparisons(
          response.data.comparisons || []
        );
      } catch (error) {
        console.error(
          "Transport comparison error:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to compare transport modes."
        );
      } finally {
        setComparisonLoading(false);
      }
    };

  // =========================
  // SAVE TRIP
  // =========================

  const handleSaveTrip = async () => {
    setError("");
    setSaveMessage("");

    if (!route) {
      setError(
        "Please calculate the route first."
      );
      return;
    }

    if (!selectedTransportMode) {
      setError(
        "Please select a transport mode first."
      );
      return;
    }

    if (!calculation) {
      setError(
        "Please calculate the trip details before saving."
      );
      return;
    }

    const selectedMode =
      transportModes.find(
        (mode) =>
          mode._id === selectedTransportMode
      );

    if (!selectedMode) {
      setError(
        "Selected transport mode was not found."
      );
      return;
    }

    try {
      setSaveLoading(true);

      const response = await api.post(
        "/api/user/trips",
        {
          start: {
            name: startLocation.name,
            latitude: startLocation.latitude,
            longitude: startLocation.longitude,
          },

          destination: {
            name: destinationLocation.name,
            latitude:
              destinationLocation.latitude,
            longitude:
              destinationLocation.longitude,
          },

          distanceKm: route.distanceKm,

          durationMinutes:
            route.durationMinutes,

          transportMode:
            selectedMode._id,

          transportModeName:
            selectedMode.name,

          fuelType:
            calculation.transportMode
              ?.fuelType ||
            selectedMode.fuelType ||
            "None",

          fuelUsed:
            calculation.fuelUsed || 0,

          fuelUnit:
            calculation.consumptionUnit || "",

          tripCost:
            calculation.tripCost || 0,

          co2Emission:
            calculation.co2Emission || 0,

          ecoScore:
            calculation.ecoScore || 0,
        }
      );

      if (response.data.success) {
        setSaveMessage(
          "Trip saved successfully!"
        );
      }
    } catch (error) {
      console.error(
        "Save trip error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to save trip."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar navbar-dark bg-success">
        <div className="container">
          <span className="navbar-brand fw-bold">
            🌱 GreenRoute
          </span>

          <div>
            <button
              className="btn btn-light btn-sm me-2"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Dashboard
            </button>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="container py-4">
        <div className="mb-4">
          <h2 className="fw-bold text-success">
            Plan Your Route
          </h2>

          <p className="text-muted">
            Enter your starting point and
            destination to calculate your
            route and compare transportation
            options.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* SAVE SUCCESS */}

        {saveMessage && (
          <div
            className="alert alert-success"
            role="alert"
          >
            {saveMessage}
          </div>
        )}

        {/* =========================
            LOCATION SECTION
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title fw-bold">
              📍 Route Locations
            </h5>

            <div className="row g-4 mt-1">
              {/* START */}

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Starting Point
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter starting location"
                  value={startQuery}
                  onChange={(event) => {
                    setStartQuery(
                      event.target.value
                    );

                    setStartLocation(null);
                    setRoute(null);
                    setCalculation(null);
                    setComparisons([]);
                    setSaveMessage("");
                  }}
                />

                {startSuggestions.length >
                  0 && (
                  <div className="list-group mt-1">
                    {startSuggestions.map(
                      (location, index) => (
                        <button
                          key={`${location.osmType}-${location.osmId}-${index}`}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() =>
                            handleSelectStart(
                              location
                            )
                          }
                        >
                          <div className="fw-semibold">
                            {location.name}
                          </div>

                          <small className="text-muted">
                            {location.category ||
                              location.type}
                          </small>
                        </button>
                      )
                    )}
                  </div>
                )}

                {startLocation && (
                  <small className="text-success d-block mt-2">
                    ✓ Starting location
                    selected
                  </small>
                )}
              </div>

              {/* DESTINATION */}

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Destination
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter destination"
                  value={destinationQuery}
                  onChange={(event) => {
                    setDestinationQuery(
                      event.target.value
                    );

                    setDestinationLocation(
                      null
                    );
                    setRoute(null);
                    setCalculation(null);
                    setComparisons([]);
                    setSaveMessage("");
                  }}
                />

                {destinationSuggestions.length >
                  0 && (
                  <div className="list-group mt-1">
                    {destinationSuggestions.map(
                      (location, index) => (
                        <button
                          key={`${location.osmType}-${location.osmId}-${index}`}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() =>
                            handleSelectDestination(
                              location
                            )
                          }
                        >
                          <div className="fw-semibold">
                            {location.name}
                          </div>

                          <small className="text-muted">
                            {location.category ||
                              location.type}
                          </small>
                        </button>
                      )
                    )}
                  </div>
                )}

                {destinationLocation && (
                  <small className="text-success d-block mt-2">
                    ✓ Destination selected
                  </small>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                className="btn btn-success"
                onClick={
                  handleCalculateRoute
                }
                disabled={routeLoading}
              >
                {routeLoading
                  ? "Calculating Route..."
                  : "Calculate Route"}
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            ROUTE RESULT
        ========================= */}

        {route && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-success">
                🛣️ Route Details
              </h5>

              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light">
                    <small className="text-muted">
                      Starting Point
                    </small>

                    <div className="fw-semibold mt-1">
                      {route.start?.name ||
                        startLocation?.name}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light">
                    <small className="text-muted">
                      Destination
                    </small>

                    <div className="fw-semibold mt-1">
                      {route.destination
                        ?.name ||
                        destinationLocation?.name}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Distance
                    </small>

                    <h4 className="mb-0 mt-1">
                      {route.distanceKm} km
                    </h4>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Estimated Travel Time
                    </small>

                    <h4 className="mb-0 mt-1">
                      {route.durationMinutes}{" "}
                      minutes
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            TRANSPORT MODE
        ========================= */}

        {route && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold">
                🚗 Select Transport Mode
              </h5>

              <div className="row align-items-end g-3 mt-1">
                <div className="col-md-8">
                  <label className="form-label">
                    Transport Mode
                  </label>

                  <select
                    className="form-select"
                    value={
                      selectedTransportMode
                    }
                    onChange={
                      handleTransportModeChange
                    }
                  >
                    <option value="">
                      Select transport mode
                    </option>

                    {transportModes.map(
                      (mode) => (
                        <option
                          key={mode._id}
                          value={mode._id}
                        >
                          {mode.name}{" "}
                          {mode.category
                            ? `(${mode.category})`
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="col-md-4">
                  <button
                    className="btn btn-success w-100"
                    onClick={
                      handleCalculateCost
                    }
                    disabled={
                      calculationLoading
                    }
                  >
                    {calculationLoading
                      ? "Calculating..."
                      : "Calculate Trip"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            CALCULATION RESULT
        ========================= */}

        {calculation && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-success">
                📊 Trip Calculation
              </h5>

              <div className="row g-3 mt-1">
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">
                      Distance
                    </small>

                    <h4 className="mt-1 mb-0">
                      {
                        calculation.distanceKm
                      }{" "}
                      km
                    </h4>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">
                      Fuel Consumption
                    </small>

                    <h4 className="mt-1 mb-0">
                      {
                        calculation.consumption
                      }{" "}
                      {calculation.consumptionUnit
                        ? `(${calculation.consumptionUnit})`
                        : ""}
                    </h4>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">
                      Fuel / Energy Used
                    </small>

                    <h4 className="mt-1 mb-0">
                      {calculation.fuelUsed}
                    </h4>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">
                      Fuel Price
                    </small>

                    <h4 className="mt-1 mb-0">
                      ₹
                      {Number(
                        calculation.fuelPrice ||
                          0
                      ).toFixed(2)}
                    </h4>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">
                      Estimated Trip Cost
                    </small>

                    <h4 className="mt-1 mb-0 text-success">
                      ₹
                      {Number(
                        calculation.tripCost ||
                          0
                      ).toFixed(2)}
                    </h4>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">
                      CO₂ Emission
                    </small>

                    <h4 className="mt-1 mb-0">
                      {
                        calculation.co2Emission
                      }{" "}
                      kg
                    </h4>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">
                      Eco Score
                    </small>

                    <h4 className="mt-1 mb-0 text-success">
                      {calculation.ecoScore}
                      /100
                    </h4>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">
                      Transport Mode
                    </small>

                    <h4 className="mt-1 mb-0">
                      {
                        calculation
                          .transportMode
                          ?.name
                      }
                    </h4>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="btn btn-primary"
                  onClick={handleSaveTrip}
                  disabled={saveLoading}
                >
                  {saveLoading
                    ? "Saving Trip..."
                    : "💾 Save Trip"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            COMPARISON
        ========================= */}

        {route && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-success">
                🔄 Compare Transport Modes
              </h5>

              <p className="text-muted">
                Compare available transport modes
                for this route based on cost,
                CO₂ emissions, energy use and
                Eco Score.
              </p>

              <button
                className="btn btn-outline-success"
                onClick={
                  handleCompareTransportModes
                }
                disabled={
                  comparisonLoading
                }
              >
                {comparisonLoading
                  ? "Comparing..."
                  : "Compare Transport Modes"}
              </button>

              {comparisons.length > 0 && (
                <div className="table-responsive mt-4">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>
                          Transport Mode
                        </th>

                        <th>Category</th>

                        <th>
                          Fuel / Energy
                        </th>

                        <th>
                          Fuel / Energy Used
                        </th>

                        <th>
                          Estimated Cost
                        </th>

                        <th>
                          CO₂ Emission
                        </th>

                        <th>
                          Eco Score
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {comparisons.map(
                        (comparison) => (
                          <tr
                            key={
                              comparison.transportModeId
                            }
                          >
                            <td className="fw-semibold">
                              {
                                comparison.name
                              }
                            </td>

                            <td>
                              {
                                comparison.category
                              }
                            </td>

                            <td>
                              {
                                comparison.fuelType
                              }
                            </td>

                            <td>
                              {
                                comparison.fuelUsed
                              }
                            </td>

                            <td>
                              ₹
                              {Number(
                                comparison.cost ||
                                  0
                              ).toFixed(2)}
                            </td>

                            <td>
                              {
                                comparison.co2Kg
                              }{" "}
                              kg
                            </td>

                            <td className="fw-semibold">
                              {
                                comparison.ecoScore
                              }
                              /100
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================
            BACK TO DASHBOARD
        ========================= */}

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default RoutePlanner;