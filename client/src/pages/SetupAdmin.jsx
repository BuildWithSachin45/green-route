import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SetupAdmin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    setupKey: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/create-first-admin",
        formData
      );

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        setupKey: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-4">

                <h2 className="text-center text-success fw-bold mb-2">
                  🌱 GreenRoute
                </h2>

                <h5 className="text-center mb-4">
                  First Admin Setup
                </h5>

                {message && (
                  <div className="alert alert-success">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">
                      Admin Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Admin Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Admin Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Setup Key
                    </label>

                    <input
                      type="password"
                      name="setupKey"
                      className="form-control"
                      value={formData.setupKey}
                      onChange={handleChange}
                      required
                    />

                    <div className="form-text">
                      Enter the ADMIN_SETUP_KEY from your server .env file.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Admin..."
                      : "Create First Admin"}
                  </button>

                </form>

                <div className="text-center mt-3">
                  <button
                    className="btn btn-link"
                    onClick={() => navigate("/login")}
                  >
                    Back to Login
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupAdmin;