import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { useVolunteerAuth } from "../../context/VolunteerAuthContext";

function VLogin() {
  const { login, isAuthenticated } = useVolunteerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Message passed from auth-gated pages (e.g. "Please signup or login first.")
  const authMessage = location.state?.authMessage || null;
  const returnTo = location.state?.returnTo || "/volunteer/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/volunteer/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Go back to where they came from, or dashboard
      if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("/volunteer/login")) {
        window.location.href = returnTo; // use full navigation for hash anchors like /#register
      } else {
        navigate("/volunteer/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v-auth-page">
      <div className="page-bg" />

      <div className="v-auth-container">
        <div className="v-auth-card glass-card">
          <div className="v-auth-header">
            <Link to="/" className="v-auth-brand">
              <span className="navbar-brand-icon">V</span>
            </Link>
            <h1>Volunteer Login</h1>
            <p>Sign in to access your dashboard</p>
          </div>

          {/* Auth redirect message */}
          {authMessage && (
            <div className="v-auth-notice">
              <FaInfoCircle />
              <span>{authMessage}</span>
            </div>
          )}

          {error && (
            <div className="admin-alert admin-alert-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="v-auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="v-email">Email</label>
              <div className="admin-input-icon">
                <FaEnvelope />
                <input
                  id="v-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="v-password">Password</label>
              <div className="admin-input-icon">
                <FaLock />
                <input
                  id="v-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="v-eye-btn v-eye-btn-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary v-auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="v-auth-footer-text">
            Don&apos;t have an account?{" "}
            <Link to="/volunteer/signup" className="v-auth-link">
              Create one
            </Link>
          </p>

          <Link to="/" className="admin-back-link">
            &larr; Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VLogin;
