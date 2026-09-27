
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UserDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [transportModes, setTransportModes] = useState([]);
  const [fuelPrices, setFuelPrices] = useState([]);
  const [trips, setTrips] = useState([]);

  const [tripsLoading, setTripsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/user/profile");

      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      throw error;
    }
  };

  // =========================
  // FETCH TRANSPORT MODES
  // =========================

  const fetchTransportModes = async () => {
    try {
      const response = await api.get(
        "/api/user/transport-modes"
      );

      if (response.data.success) {
        setTransportModes(
          response.data.transportModes || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch transport modes error:",
        error
      );
      throw error;
    }
  };

  // =========================
  // FETCH FUEL PRICES
  // =========================

  const fetchFuelPrices = async () => {
    try {
      const response = await api.get(
        "/api/user/fuel-prices"
      );

      if (response.data.success) {
        setFuelPrices(
          response.data.fuelPrices || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch fuel prices error:",
        error
      );
      throw error;
    }
  };

  // =========================
  // FETCH MY TRIPS
  // =========================

  const fetchTrips = async () => {
    try {
      setTripsLoading(true);

      const response = await api.get(
        "/api/user/trips"
      );

      if (response.data.success) {
        setTrips(response.data.trips || []);
      }
    } catch (error) {
      console.error("Fetch trips error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch saved trips."
      );
    } finally {
      setTripsLoading(false);
    }
  };

  // =========================
  // REFRESH ALL DATA
  // =========================

  const refreshAll = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await Promise.all([
        fetchProfile(),
        fetchTransportModes(),
        fetchFuelPrices(),
        fetchTrips(),
      ]);

      setMessage("Dashboard refreshed successfully.");
    } catch (error) {
      console.error(
        "Refresh dashboard error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to refresh dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE TRIP
  // =========================

  const handleDeleteTrip = async (tripId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this saved trip?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await api.delete(
        `/api/user/trips/${tripId}`
      );

      if (response.data.success) {
        setTrips((previousTrips) =>
          previousTrips.filter(
            (trip) => trip._id !== tripId
          )
        );

        setMessage("Trip deleted successfully.");
      }
    } catch (error) {
      console.error(
        "Delete trip error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete trip."
      );
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

  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {
    refreshAll();
  }, []);

  // =========================
  // PERSONAL STATISTICS
  // =========================

  const totalTrips = trips.length;

  const totalDistance = trips.reduce(
    (total, trip) =>
      total + Number(trip.distanceKm || 0),
    0
  );

  const totalCost = trips.reduce(
    (total, trip) =>
      total + Number(trip.tripCost || 0),
    0
  );

  const totalCO2 = trips.reduce(
    (total, trip) =>
      total + Number(trip.co2Emission || 0),
    0
  );

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <nav className="navbar navbar-dark bg-success">
          <div className="container">
            <span className="navbar-brand fw-bold">
              🌱 GreenRoute
            </span>
          </div>
        </nav>

        <div className="container py-5 text-center">
          <div
            className="spinner-border text-success"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3 text-muted">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar navbar-dark bg-success shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">
            🌱 GreenRoute
          </span>

          <div className="d-flex align-items-center gap-2">
            <span className="text-white d-none d-md-inline">
              Welcome,{" "}
              <strong>
                {profile?.name || "User"}
              </strong>
            </span>

            <button
              className="btn btn-light btn-sm"
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
        {/* PAGE HEADER */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1">
              User Dashboard
            </h2>

            <p className="text-muted mb-0">
              Plan sustainable routes and manage
              your saved trips.
            </p>
          </div>

          <div className="mt-3 mt-md-0 d-flex gap-2">
            <button
              className="btn btn-outline-success"
              onClick={refreshAll}
            >
              🔄 Refresh
            </button>

            <button
              className="btn btn-success"
              onClick={() =>
                navigate("/route-planner")
              }
            >
              🛣️ Plan Route
            </button>
          </div>
        </div>

        {/* =========================
            ALERTS
        ========================= */}

        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            className="alert alert-success"
            role="alert"
          >
            {message}
          </div>
        )}

        {/* =========================
            PROFILE
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">
              👤 My Profile
            </h5>
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <small className="text-muted">
                  Name
                </small>

                <div className="fw-semibold">
                  {profile?.name || "-"}
                </div>
              </div>

              <div className="col-md-4">
                <small className="text-muted">
                  Email
                </small>

                <div className="fw-semibold">
                  {profile?.email || "-"}
                </div>
              </div>

              <div className="col-md-4">
                <small className="text-muted">
                  Account Role
                </small>

                <div className="fw-semibold text-capitalize">
                  {profile?.role || "user"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            PERSONAL STATISTICS
        ========================= */}

        <div className="row g-4 mb-4">
          {/* TOTAL TRIPS */}

          <div className="col-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">
                  Saved Trips
                </small>

                <h3 className="fw-bold text-success mt-2 mb-0">
                  {totalTrips}
                </h3>

                <small className="text-muted">
                  Total saved trips
                </small>
              </div>
            </div>
          </div>

          {/* TOTAL DISTANCE */}

          <div className="col-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">
                  Total Distance
                </small>

                <h3 className="fw-bold text-success mt-2 mb-0">
                  {totalDistance.toFixed(2)} km
                </h3>

                <small className="text-muted">
                  Across saved trips
                </small>
              </div>
            </div>
          </div>

          {/* TOTAL COST */}

          <div className="col-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">
                  Total Trip Cost
                </small>

                <h3 className="fw-bold text-success mt-2 mb-0">
                  ₹{totalCost.toFixed(2)}
                </h3>

                <small className="text-muted">
                  Across saved trips
                </small>
              </div>
            </div>
          </div>

          {/* TOTAL CO2 */}

          <div className="col-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">
                  Total CO₂ Emission
                </small>

                <h3 className="fw-bold text-success mt-2 mb-0">
                  {totalCO2.toFixed(2)} kg
                </h3>

                <small className="text-muted">
                  Across saved trips
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            QUICK ACTION
        ========================= */}

        <div className="card shadow-sm mb-4 border-success">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h5 className="fw-bold text-success">
                  🛣️ Plan a New Route
                </h5>

                <p className="text-muted mb-md-0">
                  Compare available transport modes,
                  calculate travel cost and CO₂
                  emissions, and choose a more
                  sustainable option.
                </p>
              </div>

              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    navigate("/route-planner")
                  }
                >
                  Start Route Planning
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            MY TRIPS
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              🧳 My Trips
            </h5>

            {tripsLoading && (
              <div
                className="spinner-border spinner-border-sm text-success"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>
            )}
          </div>

          <div className="card-body">
            {trips.length === 0 &&
            !tripsLoading ? (
              <div className="text-center py-4">
                <div className="fs-1">🧳</div>

                <h5 className="mt-2">
                  No saved trips yet
                </h5>

                <p className="text-muted">
                  Your saved routes will appear here.
                </p>

                <button
                  className="btn btn-success"
                  onClick={() =>
                    navigate("/route-planner")
                  }
                >
                  Plan Your First Route
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Distance</th>
                      <th>Time</th>
                      <th>Transport</th>
                      <th>Cost</th>
                      <th>CO₂</th>
                      <th>Fuel / Energy</th>
                      <th>Eco Score</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip._id}>
                        <td>
                          <div
                            className="text-truncate"
                            style={{
                              maxWidth: "180px",
                            }}
                            title={
                              trip.start?.name || "-"
                            }
                          >
                            {trip.start?.name || "-"}
                          </div>
                        </td>

                        <td>
                          <div
                            className="text-truncate"
                            style={{
                              maxWidth: "180px",
                            }}
                            title={
                              trip.destination?.name ||
                              "-"
                            }
                          >
                            {trip.destination?.name ||
                              "-"}
                          </div>
                        </td>

                        <td>
                          {Number(
                            trip.distanceKm || 0
                          ).toFixed(2)}{" "}
                          km
                        </td>

                        <td>
                          {Number(
                            trip.durationMinutes || 0
                          ).toFixed(1)}{" "}
                          min
                        </td>

                        <td>
                          <span className="badge bg-success">
                            {trip.transportModeName ||
                              trip.transportMode?.name ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          ₹
                          {Number(
                            trip.tripCost || 0
                          ).toFixed(2)}
                        </td>

                        <td>
                          {Number(
                            trip.co2Emission || 0
                          ).toFixed(2)}{" "}
                          kg
                        </td>

                        <td>
                          {Number(
                            trip.fuelUsed || 0
                          ).toFixed(2)}{" "}
                          {trip.fuelUnit || ""}
                        </td>

                        <td>
                          <span className="badge bg-success">
                            {Number(
                              trip.ecoScore || 0
                            ).toFixed(0)}
                            /100
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDeleteTrip(
                                trip._id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* =========================
            AVAILABLE TRANSPORT MODES
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">
              🚗 Available Transport Modes
            </h5>
          </div>

          <div className="card-body">
            {transportModes.length === 0 ? (
              <p className="text-muted mb-0">
                No active transport modes available.
              </p>
            ) : (
              <div className="row g-3">
                {transportModes.map((mode) => (
                  <div
                    className="col-md-6 col-lg-4"
                    key={mode._id}
                  >
                    <div className="border rounded p-3 h-100">
                      <h6 className="fw-bold text-success">
                        {mode.name}
                      </h6>

                      <p className="mb-1">
                        <strong>
                          Category:
                        </strong>{" "}
                        {mode.category}
                      </p>

                      <p className="mb-1">
                        <strong>
                          Fuel Type:
                        </strong>{" "}
                        {mode.fuelType || "None"}
                      </p>

                      <p className="mb-0">
                        <strong>
                          Eco Score:
                        </strong>{" "}
                        {mode.ecoScore ?? "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =========================
            FUEL PRICES
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">
              ⛽ Current Fuel Prices
            </h5>
          </div>

          <div className="card-body">
            {fuelPrices.length === 0 ? (
              <p className="text-muted mb-0">
                No active fuel prices available.
              </p>
            ) : (
              <div className="row g-3">
                {fuelPrices.map((fuel) => (
                  <div
                    className="col-md-6 col-lg-4"
                    key={fuel._id}
                  >
                    <div className="border rounded p-3 h-100">
                      <h6 className="fw-bold text-success">
                        {fuel.fuelType}
                      </h6>

                      <div className="fs-5 fw-bold">
                        ₹
                        {Number(
                          fuel.pricePerUnit || 0
                        ).toFixed(2)}
                      </div>

                      <small className="text-muted">
                        per {fuel.unit}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="text-center text-muted py-3">
          <small>
            🌱 GreenRoute — Sustainable
            Transportation & Route Management
          </small>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;