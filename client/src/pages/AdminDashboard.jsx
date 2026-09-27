
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  // =========================
  // USERS
  // =========================
  const [users, setUsers] = useState([]);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // =========================
  // TRANSPORT MODES
  // =========================
  const [transportModes, setTransportModes] = useState([]);

  const [transportForm, setTransportForm] = useState({
    name: "",
    category: "",
    fuelType: "",
    ticketFare: "",
    emissionFactor: "",
    ecoScore: "",
  });

  const [editingTransportId, setEditingTransportId] =
    useState(null);

  // =========================
  // FUEL PRICES
  // =========================
  const [fuelPrices, setFuelPrices] = useState([]);

  const [fuelForm, setFuelForm] = useState({
    fuelType: "",
    pricePerUnit: "",
    unit: "",
  });

  const [editingFuelId, setEditingFuelId] =
    useState(null);

  // =========================
  // FUEL CONSUMPTION
  // =========================
  const [fuelConsumptions, setFuelConsumptions] =
    useState([]);

  const [consumptionForm, setConsumptionForm] =
    useState({
      transportMode: "",
      consumption: "",
      unit: "",
    });

  const [editingConsumptionId, setEditingConsumptionId] =
    useState(null);

  // =========================
  // STATISTICS
  // =========================
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    totalTransportModes: 0,
    activeTransportModes: 0,
    totalFuelPrices: 0,
    activeFuelPrices: 0,
  });

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const response = await api.get(
        "/api/admin/users"
      );

      setUsers(response.data.users || []);
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );
    }
  };

  // =========================
  // FETCH TRANSPORT MODES
  // =========================
  const fetchTransportModes = async () => {
    try {
      const response = await api.get(
        "/api/admin/transport-modes"
      );

      setTransportModes(
        response.data.transportModes || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch transport modes:",
        error
      );
    }
  };

  // =========================
  // FETCH FUEL PRICES
  // =========================
  const fetchFuelPrices = async () => {
    try {
      const response = await api.get(
        "/api/admin/fuel-prices"
      );

      setFuelPrices(
        response.data.fuelPrices || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch fuel prices:",
        error
      );
    }
  };

  // =========================
  // FETCH FUEL CONSUMPTION
  // =========================
  const fetchFuelConsumptions = async () => {
    try {
      const response = await api.get(
        "/api/admin/fuel-consumption"
      );

      setFuelConsumptions(
        response.data.consumptions || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch fuel consumptions:",
        error
      );
    }
  };

  // =========================
  // FETCH STATISTICS
  // =========================
  const fetchStats = async () => {
    try {
      const response = await api.get(
        "/api/admin/stats"
      );

      setStats(
        response.data.stats || {
          totalUsers: 0,
          totalAdmins: 0,
          activeUsers: 0,
          totalTransportModes: 0,
          activeTransportModes: 0,
          totalFuelPrices: 0,
          activeFuelPrices: 0,
        }
      );
    } catch (error) {
      console.error(
        "Failed to fetch statistics:",
        error
      );
    }
  };

  // =========================
  // LOAD ALL DATA
  // =========================
  useEffect(() => {
    fetchUsers();
    fetchTransportModes();
    fetchFuelPrices();
    fetchFuelConsumptions();
    fetchStats();
  }, []);

  // =========================
  // USER FORM
  // =========================
  const handleUserChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/api/admin/users",
        userForm
      );

      alert("User created successfully");

      setUserForm({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      fetchUsers();
      fetchStats();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create user"
      );
    }
  };

  // =========================
  // USER STATUS
  // =========================
  const toggleUserStatus = async (id) => {
    try {
      await api.patch(
        `/api/admin/users/${id}/status`
      );

      fetchUsers();
      fetchStats();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update user status"
      );
    }
  };

  // =========================
  // TRANSPORT FORM
  // =========================
  const handleTransportChange = (e) => {
    setTransportForm({
      ...transportForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransportSubmit = async (e) => {
    e.preventDefault();

    try {
      const transportData = {
        ...transportForm,
        ticketFare:
          transportForm.ticketFare === ""
            ? 0
            : Number(transportForm.ticketFare),
      };

      if (editingTransportId) {
        await api.put(
          `/api/admin/transport-modes/${editingTransportId}`,
          transportData
        );

        alert(
          "Transport mode updated successfully"
        );
      } else {
        await api.post(
          "/api/admin/transport-modes",
          transportData
        );

        alert(
          "Transport mode added successfully"
        );
      }

      setTransportForm({
        name: "",
        category: "",
        fuelType: "",
        ticketFare: "",
        emissionFactor: "",
        ecoScore: "",
      });

      setEditingTransportId(null);

      fetchTransportModes();
      fetchFuelConsumptions();
      fetchStats();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save transport mode"
      );
    }
  };

  // =========================
  // EDIT TRANSPORT
  // =========================
  const editTransport = (mode) => {
    setEditingTransportId(mode._id);

    setTransportForm({
      name: mode.name,
      category: mode.category,
      fuelType: mode.fuelType,
      ticketFare:
        mode.ticketFare !== undefined &&
        mode.ticketFare !== null
          ? mode.ticketFare
          : 0,
      emissionFactor: mode.emissionFactor,
      ecoScore: mode.ecoScore,
    });
  };

  // =========================
  // CANCEL TRANSPORT EDIT
  // =========================
  const cancelTransportEdit = () => {
    setEditingTransportId(null);

    setTransportForm({
      name: "",
      category: "",
      fuelType: "",
      ticketFare: "",
      emissionFactor: "",
      ecoScore: "",
    });
  };

  // =========================
  // TRANSPORT STATUS
  // =========================
  const toggleTransportStatus = async (id) => {
    try {
      await api.patch(
        `/api/admin/transport-modes/${id}/status`
      );

      fetchTransportModes();
      fetchFuelConsumptions();
      fetchStats();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update transport status"
      );
    }
  };

  // =========================
  // FUEL PRICE FORM
  // =========================
  const handleFuelChange = (e) => {
    setFuelForm({
      ...fuelForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFuelId) {
        await api.put(
          `/api/admin/fuel-prices/${editingFuelId}`,
          fuelForm
        );

        alert(
          "Fuel price updated successfully"
        );
      } else {
        await api.post(
          "/api/admin/fuel-prices",
          fuelForm
        );

        alert(
          "Fuel price added successfully"
        );
      }

      setFuelForm({
        fuelType: "",
        pricePerUnit: "",
        unit: "",
      });

      setEditingFuelId(null);

      fetchFuelPrices();
      fetchStats();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save fuel price"
      );
    }
  };

  // =========================
  // EDIT FUEL PRICE
  // =========================
  const editFuelPrice = (fuel) => {
    setEditingFuelId(fuel._id);

    setFuelForm({
      fuelType: fuel.fuelType,
      pricePerUnit: fuel.pricePerUnit,
      unit: fuel.unit,
    });
  };

  // =========================
  // CANCEL FUEL EDIT
  // =========================
  const cancelFuelEdit = () => {
    setEditingFuelId(null);

    setFuelForm({
      fuelType: "",
      pricePerUnit: "",
      unit: "",
    });
  };

  // =========================
  // FUEL PRICE STATUS
  // =========================
  const toggleFuelStatus = async (id) => {
    try {
      await api.patch(
        `/api/admin/fuel-prices/${id}/status`
      );

      fetchFuelPrices();
      fetchStats();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update fuel price status"
      );
    }
  };

  // =========================
  // FUEL CONSUMPTION FORM
  // =========================
  const handleConsumptionChange = (e) => {
    setConsumptionForm({
      ...consumptionForm,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD / UPDATE CONSUMPTION
  // =========================
  const handleConsumptionSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingConsumptionId) {
        await api.put(
          `/api/admin/fuel-consumption/${editingConsumptionId}`,
          consumptionForm
        );

        alert(
          "Fuel consumption updated successfully"
        );
      } else {
        await api.post(
          "/api/admin/fuel-consumption",
          consumptionForm
        );

        alert(
          "Fuel consumption added successfully"
        );
      }

      setConsumptionForm({
        transportMode: "",
        consumption: "",
        unit: "",
      });

      setEditingConsumptionId(null);

      fetchFuelConsumptions();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save fuel consumption"
      );
    }
  };

  // =========================
  // EDIT CONSUMPTION
  // =========================
  const editConsumption = (item) => {
    setEditingConsumptionId(item._id);

    setConsumptionForm({
      transportMode:
        item.transportMode?._id || "",
      consumption: item.consumption,
      unit: item.unit,
    });
  };

  // =========================
  // CANCEL CONSUMPTION EDIT
  // =========================
  const cancelConsumptionEdit = () => {
    setEditingConsumptionId(null);

    setConsumptionForm({
      transportMode: "",
      consumption: "",
      unit: "",
    });
  };

  // =========================
  // CONSUMPTION STATUS
  // =========================
  const toggleConsumptionStatus = async (
    id
  ) => {
    try {
      await api.patch(
        `/api/admin/fuel-consumption/${id}/status`
      );

      fetchFuelConsumptions();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update consumption status"
      );
    }
  };

  // =========================
  // REFRESH ALL
  // =========================
  const refreshAll = async () => {
    await fetchUsers();
    await fetchTransportModes();
    await fetchFuelPrices();
    await fetchFuelConsumptions();
    await fetchStats();
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
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
            🌱 GreenRoute Admin
          </span>

          <div className="d-flex align-items-center gap-3">
            <span className="text-white">
              Admin
            </span>

            <button
              className="btn btn-light btn-sm"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        {/* =========================
            HEADER
        ========================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-success">
              Admin Dashboard
            </h2>

            <p className="text-muted mb-0">
              Manage users, transport, fuel and
              system data.
            </p>
          </div>

          <button
            className="btn btn-outline-success"
            onClick={refreshAll}
          >
            🔄 Refresh All
          </button>
        </div>

        {/* =========================
            SYSTEM STATISTICS
        ========================= */}

        <div className="row g-3 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  Total Users
                </h6>

                <h2 className="fw-bold">
                  {stats.totalUsers}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  Total Admins
                </h6>

                <h2 className="fw-bold">
                  {stats.totalAdmins}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  Active Users
                </h6>

                <h2 className="fw-bold">
                  {stats.activeUsers}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  Transport Modes
                </h6>

                <h2 className="fw-bold">
                  {stats.totalTransportModes}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  Active Transport
                </h6>

                <h2 className="fw-bold text-success">
                  {stats.activeTransportModes}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  Fuel Prices
                </h6>

                <h2 className="fw-bold">
                  {stats.totalFuelPrices}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  Active Fuel Prices
                </h6>

                <h2 className="fw-bold text-success">
                  {stats.activeFuelPrices}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            ADD USER
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="text-success mb-4">
              Add User / Admin
            </h4>

            <form
              onSubmit={handleAddUser}
              className="row g-3"
            >
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  name="name"
                  value={userForm.name}
                  onChange={handleUserChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={userForm.password}
                  onChange={handleUserChange}
                  required
                />
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  name="role"
                  value={userForm.role}
                  onChange={handleUserChange}
                >
                  <option value="user">
                    User
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              <div className="col-md-1">
                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* =========================
            USERS
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-success mb-0">
                Users
              </h4>

              <button
                className="btn btn-outline-success btn-sm"
                onClick={fetchUsers}
              >
                Refresh
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center text-muted"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>

                        <td>{user.email}</td>

                        <td>
                          <span className="badge bg-primary">
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              user.isActive
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {user.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td>
                          <button
                            className={`btn btn-sm ${
                              user.isActive
                                ? "btn-danger"
                                : "btn-success"
                            }`}
                            onClick={() =>
                              toggleUserStatus(
                                user._id
                              )
                            }
                          >
                            {user.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* =========================
            TRANSPORT MODES
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="text-success mb-4">
              Transport Modes
            </h4>

            <form
              onSubmit={handleTransportSubmit}
              className="row g-3 mb-4"
            >
              <div className="col-md-3">
                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={transportForm.name}
                  onChange={handleTransportChange}
                  placeholder="e.g. Car"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Category
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={
                    transportForm.category
                  }
                  onChange={handleTransportChange}
                  placeholder="e.g. Private"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Fuel Type
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="fuelType"
                  value={
                    transportForm.fuelType
                  }
                  onChange={handleTransportChange}
                  placeholder="e.g. Petrol"
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Ticket Fare (₹)
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="ticketFare"
                  value={
                    transportForm.ticketFare
                  }
                  onChange={handleTransportChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 20"
                />

                <small className="text-muted">
                  Use for public transport.
                </small>
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Emission Factor
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="emissionFactor"
                  value={
                    transportForm.emissionFactor
                  }
                  onChange={handleTransportChange}
                  min="0"
                  step="0.01"
                  placeholder="g/km"
                  required
                />
              </div>

              <div className="col-md-1">
                <label className="form-label">
                  Eco
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="ecoScore"
                  value={
                    transportForm.ecoScore
                  }
                  onChange={handleTransportChange}
                  min="0"
                  max="100"
                  step="1"
                  placeholder="0-100"
                  required
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  {editingTransportId
                    ? "Update Transport"
                    : "Add Transport"}
                </button>

                {editingTransportId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      cancelTransportEdit
                    }
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Fuel Type</th>
                    <th>Ticket Fare</th>
                    <th>Emission Factor</th>
                    <th>Eco Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {transportModes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-muted"
                      >
                        No transport modes
                        available.
                      </td>
                    </tr>
                  ) : (
                    transportModes.map(
                      (mode) => (
                        <tr key={mode._id}>
                          <td>{mode.name}</td>

                          <td>
                            {mode.category}
                          </td>

                          <td>
                            {mode.fuelType ||
                              "None"}
                          </td>

                          <td>
                            ₹{" "}
                            {Number(
                              mode.ticketFare || 0
                            ).toFixed(2)}
                          </td>

                          <td>
                            {mode.emissionFactor}
                          </td>

                          <td>
                            {mode.ecoScore}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                mode.isActive
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {mode.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() =>
                                editTransport(
                                  mode
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className={`btn btn-sm ${
                                mode.isActive
                                  ? "btn-danger"
                                  : "btn-success"
                              }`}
                              onClick={() =>
                                toggleTransportStatus(
                                  mode._id
                                )
                              }
                            >
                              {mode.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* =========================
            FUEL PRICES
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="text-success mb-4">
              Fuel Prices
            </h4>

            <form
              onSubmit={handleFuelSubmit}
              className="row g-3 mb-4"
            >
              <div className="col-md-4">
                <label className="form-label">
                  Fuel Type
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="fuelType"
                  value={fuelForm.fuelType}
                  onChange={handleFuelChange}
                  placeholder="e.g. Petrol"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Price Per Unit
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="pricePerUnit"
                  value={
                    fuelForm.pricePerUnit
                  }
                  onChange={handleFuelChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 105"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Unit
                </label>

                <select
                  className="form-select"
                  name="unit"
                  value={fuelForm.unit}
                  onChange={handleFuelChange}
                  required
                >
                  <option value="">
                    Select Unit
                  </option>

                  <option value="Litre">
                    Litre
                  </option>

                  <option value="Kg">
                    Kg
                  </option>

                  <option value="kWh">
                    kWh
                  </option>
                </select>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  {editingFuelId
                    ? "Update"
                    : "Add"}
                </button>
              </div>

              {editingFuelId && (
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={cancelFuelEdit}
                  >
                    Cancel Edit
                  </button>
                </div>
              )}
            </form>

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fuel Type</th>
                    <th>Price</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {fuelPrices.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center text-muted"
                      >
                        No fuel prices
                        available.
                      </td>
                    </tr>
                  ) : (
                    fuelPrices.map(
                      (fuel) => (
                        <tr key={fuel._id}>
                          <td>
                            {fuel.fuelType}
                          </td>

                          <td>
                            ₹{" "}
                            {fuel.pricePerUnit}
                          </td>

                          <td>
                            {fuel.unit}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                fuel.isActive
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {fuel.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() =>
                                editFuelPrice(
                                  fuel
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className={`btn btn-sm ${
                                fuel.isActive
                                  ? "btn-danger"
                                  : "btn-success"
                              }`}
                              onClick={() =>
                                toggleFuelStatus(
                                  fuel._id
                                )
                              }
                            >
                              {fuel.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* =========================
            FUEL CONSUMPTION
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="text-success mb-4">
              Fuel Consumption
            </h4>

            <form
              onSubmit={
                handleConsumptionSubmit
              }
              className="row g-3 mb-4"
            >
              <div className="col-md-4">
                <label className="form-label">
                  Transport Mode
                </label>

                <select
                  className="form-select"
                  name="transportMode"
                  value={
                    consumptionForm.transportMode
                  }
                  onChange={
                    handleConsumptionChange
                  }
                  required
                >
                  <option value="">
                    Select Transport Mode
                  </option>

                  {transportModes
                    .filter(
                      (mode) =>
                        mode.isActive
                    )
                    .map((mode) => (
                      <option
                        key={mode._id}
                        value={mode._id}
                      >
                        {mode.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Consumption
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="consumption"
                  value={
                    consumptionForm.consumption
                  }
                  onChange={
                    handleConsumptionChange
                  }
                  min="0"
                  step="0.01"
                  placeholder="e.g. 15"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Unit
                </label>

                <select
                  className="form-select"
                  name="unit"
                  value={
                    consumptionForm.unit
                  }
                  onChange={
                    handleConsumptionChange
                  }
                  required
                >
                  <option value="">
                    Select Unit
                  </option>

                  <option value="km/L">
                    km/L
                  </option>

                  <option value="km/kg">
                    km/kg
                  </option>

                  <option value="km/kWh">
                    km/kWh
                  </option>
                </select>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  {editingConsumptionId
                    ? "Update"
                    : "Add"}
                </button>
              </div>

              {editingConsumptionId && (
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={
                      cancelConsumptionEdit
                    }
                  >
                    Cancel Edit
                  </button>
                </div>
              )}
            </form>

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Transport Mode</th>
                    <th>Fuel Type</th>
                    <th>Consumption</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {fuelConsumptions.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center text-muted"
                      >
                        No fuel consumption
                        data available.
                      </td>
                    </tr>
                  ) : (
                    fuelConsumptions.map(
                      (item) => (
                        <tr key={item._id}>
                          <td>
                            {item.transportMode
                              ?.name ||
                              "N/A"}
                          </td>

                          <td>
                            {item.transportMode
                              ?.fuelType ||
                              "None"}
                          </td>

                          <td>
                            {item.consumption}
                          </td>

                          <td>
                            {item.unit}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                item.isActive
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {item.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() =>
                                editConsumption(
                                  item
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className={`btn btn-sm ${
                                item.isActive
                                  ? "btn-danger"
                                  : "btn-success"
                              }`}
                              onClick={() =>
                                toggleConsumptionStatus(
                                  item._id
                                )
                              }
                            >
                              {item.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* =========================
            SYSTEM STATISTICS
        ========================= */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="text-success">
                  System Statistics
                </h4>

                <p className="text-muted mb-0">
                  Current GreenRoute system
                  information.
                </p>
              </div>

              <button
                className="btn btn-outline-success"
                onClick={fetchStats}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;