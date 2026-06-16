import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { useVolunteerAuth } from "../../context/VolunteerAuthContext";
import { validatePhone, sanitizePhone } from "../../utils/validation";

const DOMAINS = [
  "Education",
  "Healthcare",
  "Environment",
  "Community Development",
  "Other",
];
const AVAILABILITY = ["Weekends", "Weekdays", "Evenings", "Flexible"];

function VSignup() {
  const { signup, isAuthenticated } = useVolunteerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const authMessage = location.state?.authMessage || null;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    college: "",
    skills: "",
    preferredDomain: "",
    availability: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/volunteer/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const sanitized = sanitizePhone(value);
      setForm((prev) => ({ ...prev, phone: sanitized }));
      const err = validatePhone(sanitized);
      setFieldErrors((prev) => ({ ...prev, phone: err }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.college.trim()) errors.college = "College is required";
    if (!form.skills.trim()) errors.skills = "Skills are required";
    if (!form.preferredDomain) errors.preferredDomain = "Please select a domain";
    if (!form.availability) errors.availability = "Please select availability";

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    const phoneErr = validatePhone(form.phone);
    if (phoneErr) errors.phone = phoneErr;

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await signup(payload);
      // After signup → go to login so the user explicitly authenticates
      navigate("/volunteer/login", {
        state: {
          authMessage: "Account created! Please login to continue.",
        },
      });
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v-auth-page">
      <div className="page-bg" />

      <div className="v-auth-container v-auth-container--wide">
        <div className="v-auth-card glass-card">
          <div className="v-auth-header">
            <Link to="/" className="v-auth-brand">
              <span className="navbar-brand-icon">V</span>
            </Link>
            <h1>Create Account</h1>
            <p>Join the VolunteerHub community</p>
          </div>

          {authMessage && (
            <div className="v-auth-notice">
              <FaInfoCircle />
              <span>{authMessage}</span>
            </div>
          )}

          {serverError && (
            <div className="admin-alert admin-alert-error">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="v-auth-form" noValidate>
            {/* Row 1 */}
            <div className="form-row">
              <div className={`form-group ${fieldErrors.fullName ? "form-group--error" : ""}`}>
                <label htmlFor="s-fullName">Full Name</label>
                <input
                  id="s-fullName"
                  type="text"
                  name="fullName"
                  placeholder="Jane Doe"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {fieldErrors.fullName && (
                  <span className="v-field-error">{fieldErrors.fullName}</span>
                )}
              </div>
              <div className={`form-group ${fieldErrors.email ? "form-group--error" : ""}`}>
                <label htmlFor="s-email">Email</label>
                <input
                  id="s-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <span className="v-field-error">{fieldErrors.email}</span>
                )}
              </div>
            </div>

            {/* Row 2 — passwords */}
            <div className="form-row">
              <div className={`form-group ${fieldErrors.password ? "form-group--error" : ""}`}>
                <label htmlFor="s-password">Password</label>
                <div className="v-input-icon">
                  <input
                    id="s-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="v-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="v-field-error">{fieldErrors.password}</span>
                )}
              </div>
              <div className={`form-group ${fieldErrors.confirmPassword ? "form-group--error" : ""}`}>
                <label htmlFor="s-confirm">Confirm Password</label>
                <div className="v-input-icon">
                  <input
                    id="s-confirm"
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="v-eye-btn"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="v-field-error">{fieldErrors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Row 3 — phone + college */}
            <div className="form-row">
              <div className={`form-group ${fieldErrors.phone ? "form-group--error" : ""}`}>
                <label htmlFor="s-phone">
                  Phone Number
                  <span className="v-field-hint">10 digits only</span>
                </label>
                <input
                  id="s-phone"
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                />
                {fieldErrors.phone ? (
                  <span className="v-field-error">{fieldErrors.phone}</span>
                ) : (
                  <span className="v-field-counter">{form.phone.length}/10</span>
                )}
              </div>
              <div className={`form-group ${fieldErrors.college ? "form-group--error" : ""}`}>
                <label htmlFor="s-college">College / Institution</label>
                <input
                  id="s-college"
                  type="text"
                  name="college"
                  placeholder="Your institution"
                  value={form.college}
                  onChange={handleChange}
                />
                {fieldErrors.college && (
                  <span className="v-field-error">{fieldErrors.college}</span>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className={`form-group ${fieldErrors.skills ? "form-group--error" : ""}`}>
              <label htmlFor="s-skills">Skills</label>
              <input
                id="s-skills"
                type="text"
                name="skills"
                placeholder="e.g. Teaching, First Aid, Communication"
                value={form.skills}
                onChange={handleChange}
              />
              {fieldErrors.skills && (
                <span className="v-field-error">{fieldErrors.skills}</span>
              )}
            </div>

            {/* Row 4 — domain + availability */}
            <div className="form-row">
              <div className={`form-group ${fieldErrors.preferredDomain ? "form-group--error" : ""}`}>
                <label htmlFor="s-domain">Preferred Domain</label>
                <select
                  id="s-domain"
                  name="preferredDomain"
                  value={form.preferredDomain}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a domain</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {fieldErrors.preferredDomain && (
                  <span className="v-field-error">{fieldErrors.preferredDomain}</span>
                )}
              </div>
              <div className={`form-group ${fieldErrors.availability ? "form-group--error" : ""}`}>
                <label htmlFor="s-availability">Availability</label>
                <select
                  id="s-availability"
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select availability</option>
                  {AVAILABILITY.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                {fieldErrors.availability && (
                  <span className="v-field-error">{fieldErrors.availability}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary v-auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="v-btn-spinner" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="v-auth-footer-text">
            Already have an account?{" "}
            <Link to="/volunteer/login" className="v-auth-link">
              Sign in
            </Link>
          </p>

          <Link to="/" className="admin-back-link">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VSignup;
