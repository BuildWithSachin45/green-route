import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import SetupAdmin from "./pages/SetupAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import RoutePlanner from "./pages/RoutePlanner";

function Home() {
  return (
    <div className="min-vh-100 bg-light">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <div className="container">

          <Link
            to="/"
            className="navbar-brand fw-bold fs-4"
          >
            🌱 GreenRoute
          </Link>

          <div className="d-flex gap-2">
            <Link
              to="/login"
              className="btn btn-light"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-outline-light"
            >
              Register
            </Link>
          </div>

        </div>
      </nav>


      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="bg-success text-white py-5">
        <div className="container py-5">

          <div className="row align-items-center">

            <div className="col-lg-7">

              <span className="badge bg-light text-success mb-3 px-3 py-2">
                Sustainable Transportation Platform
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Plan Smarter.
                <br />
                Travel Greener. 🌱
              </h1>

              <p className="lead mb-4">
                GreenRoute helps you compare transportation
                options based on distance, travel cost,
                CO₂ emissions and Eco Score.
              </p>

              <div className="d-flex flex-wrap gap-3">

                <Link
                  to="/register"
                  className="btn btn-light btn-lg px-4"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg px-4"
                >
                  Login
                </Link>

              </div>

            </div>


            <div className="col-lg-5 mt-5 mt-lg-0">

              <div className="bg-white text-dark rounded-4 shadow p-4">

                <h4 className="fw-bold text-success mb-3">
                  What can GreenRoute do?
                </h4>

                <div className="d-flex mb-3">
                  <div className="fs-3 me-3">📍</div>
                  <div>
                    <h6 className="fw-bold mb-1">
                      Find Your Route
                    </h6>
                    <p className="text-secondary mb-0">
                      Search locations and calculate
                      road distance and travel time.
                    </p>
                  </div>
                </div>

                <div className="d-flex mb-3">
                  <div className="fs-3 me-3">🚍</div>
                  <div>
                    <h6 className="fw-bold mb-1">
                      Compare Transport
                    </h6>
                    <p className="text-secondary mb-0">
                      Compare available transportation
                      modes for your journey.
                    </p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="fs-3 me-3">🌍</div>
                  <div>
                    <h6 className="fw-bold mb-1">
                      Travel Sustainably
                    </h6>
                    <p className="text-secondary mb-0">
                      Understand cost, CO₂ emissions
                      and Eco Score before travelling.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================
          PROJECT FEATURES
      ========================= */}

      <section className="py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              GreenRoute Features
            </h2>

            <p className="text-secondary">
              Everything you need to make informed
              transportation choices.
            </p>

          </div>


          <div className="row g-4">

            {/* Route Planning */}

            <div className="col-md-6 col-lg-3">

              <div className="card h-100 border-0 shadow-sm">

                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    📍
                  </div>

                  <h5 className="fw-bold">
                    Route Planning
                  </h5>

                  <p className="text-secondary mb-0">
                    Enter your starting point and
                    destination to calculate your route.
                  </p>

                </div>

              </div>

            </div>


            {/* Transport Comparison */}

            <div className="col-md-6 col-lg-3">

              <div className="card h-100 border-0 shadow-sm">

                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    🚆
                  </div>

                  <h5 className="fw-bold">
                    Transport Comparison
                  </h5>

                  <p className="text-secondary mb-0">
                    Compare different transportation
                    modes for the same journey.
                  </p>

                </div>

              </div>

            </div>


            {/* Cost Analysis */}

            <div className="col-md-6 col-lg-3">

              <div className="card h-100 border-0 shadow-sm">

                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    💰
                  </div>

                  <h5 className="fw-bold">
                    Cost Analysis
                  </h5>

                  <p className="text-secondary mb-0">
                    View fuel costs or preset public
                    transport ticket fares.
                  </p>

                </div>

              </div>

            </div>


            {/* Environmental Impact */}

            <div className="col-md-6 col-lg-3">

              <div className="card h-100 border-0 shadow-sm">

                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    🌍
                  </div>

                  <h5 className="fw-bold">
                    Environmental Impact
                  </h5>

                  <p className="text-secondary mb-0">
                    Understand CO₂ emissions and
                    Eco Score for each option.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className="py-5 bg-white">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              How GreenRoute Works
            </h2>

            <p className="text-secondary">
              Plan your journey in a few simple steps.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-md-6 col-lg-3">

              <div className="text-center">

                <div
                  className="rounded-circle bg-success text-white
                  d-flex align-items-center justify-content-center
                  mx-auto mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "24px",
                  }}
                >
                  1
                </div>

                <h5 className="fw-bold">
                  Create Account
                </h5>

                <p className="text-secondary">
                  Register as a user and access
                  your personal GreenRoute dashboard.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="text-center">

                <div
                  className="rounded-circle bg-success text-white
                  d-flex align-items-center justify-content-center
                  mx-auto mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "24px",
                  }}
                >
                  2
                </div>

                <h5 className="fw-bold">
                  Enter Locations
                </h5>

                <p className="text-secondary">
                  Select your starting location and
                  destination.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="text-center">

                <div
                  className="rounded-circle bg-success text-white
                  d-flex align-items-center justify-content-center
                  mx-auto mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "24px",
                  }}
                >
                  3
                </div>

                <h5 className="fw-bold">
                  Compare Options
                </h5>

                <p className="text-secondary">
                  Compare cost, CO₂ emissions and
                  Eco Score across transport modes.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="text-center">

                <div
                  className="rounded-circle bg-success text-white
                  d-flex align-items-center justify-content-center
                  mx-auto mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "24px",
                  }}
                >
                  4
                </div>

                <h5 className="fw-bold">
                  Save Your Trip
                </h5>

                <p className="text-secondary">
                  Save your calculated journey and
                  view it later from My Trips.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          USER / ADMIN FLOW
      ========================= */}

      <section className="py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              GreenRoute Project Flow
            </h2>

            <p className="text-secondary">
              The system has separate workflows for
              users and administrators.
            </p>

          </div>


          <div className="row g-4">

            {/* User Flow */}

            <div className="col-lg-6">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body p-4">

                  <h4 className="fw-bold text-success mb-4">
                    👤 User Flow
                  </h4>

                  <div className="mb-3">
                    <strong>1. Register / Login</strong>
                    <p className="text-secondary mb-0">
                      Create an account and access your
                      personal dashboard.
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>2. Plan Route</strong>
                    <p className="text-secondary mb-0">
                      Select starting point and destination.
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>3. Calculate Journey</strong>
                    <p className="text-secondary mb-0">
                      Get road distance and estimated
                      travel time.
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>4. Compare Transport</strong>
                    <p className="text-secondary mb-0">
                      Compare available transport modes
                      using cost, CO₂ and Eco Score.
                    </p>
                  </div>

                  <div>
                    <strong>5. Save Trip</strong>
                    <p className="text-secondary mb-0">
                      Save the selected journey and
                      access it from My Trips.
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* Admin Flow */}

            <div className="col-lg-6">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body p-4">

                  <h4 className="fw-bold text-success mb-4">
                    🛠️ Admin Flow
                  </h4>

                  <div className="mb-3">
                    <strong>1. Admin Login</strong>
                    <p className="text-secondary mb-0">
                      Access the administrator dashboard.
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>2. Manage Users</strong>
                    <p className="text-secondary mb-0">
                      Add, activate or deactivate users
                      and create administrators.
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>3. Manage Transport Modes</strong>
                    <p className="text-secondary mb-0">
                      Configure available transport modes,
                      Eco Score and emission factors.
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>4. Manage Pricing</strong>
                    <p className="text-secondary mb-0">
                      Maintain fuel prices and public
                      transport ticket fares.
                    </p>
                  </div>

                  <div>
                    <strong>5. Manage Consumption</strong>
                    <p className="text-secondary mb-0">
                      Maintain fuel consumption values
                      used for calculations.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="bg-success text-white py-5">

        <div className="container text-center py-4">

          <h2 className="fw-bold">
            Ready to plan a greener journey?
          </h2>

          <p className="lead mb-4">
            Start using GreenRoute to explore and
            compare your transportation options.
          </p>

          <Link
            to="/register"
            className="btn btn-light btn-lg px-5"
          >
            Start with GreenRoute
          </Link>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="bg-dark text-white py-4">

        <div className="container">

          <div className="row align-items-center">

            <div className="col-md-6">

              <h5 className="mb-1">
                🌱 GreenRoute
              </h5>

              <small className="text-secondary">
                Sustainable Transportation & Route
                Management
              </small>

            </div>

            <div className="col-md-6 text-md-end mt-3 mt-md-0">

              <small className="text-secondary">
                GreenRoute Mini Project
              </small>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}


// =========================
// APP
// =========================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/setup-admin"
          element={<SetupAdmin />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/dashboard"
          element={<UserDashboard />}
        />

        <Route
          path="/route-planner"
          element={<RoutePlanner />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;