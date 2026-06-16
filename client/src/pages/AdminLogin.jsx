import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="page-bg" />

      <div className="admin-login-container">
        <div className="admin-login-card glass-card">
          <div className="admin-login-header">
            <span className="navbar-brand-icon">V</span>
            <h1>Admin Login</h1>
            <p>Sign in to manage VolunteerHub volunteers</p>
          </div>

          {error && <div className="admin-alert admin-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="admin-email">Email</label>
              <div className="admin-input-icon">
                <FaEnvelope />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@volunteerhub.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-input-icon">
                <FaLock />
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary admin-login-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <a href="/" className="admin-back-link">
            &larr; Back to website
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
