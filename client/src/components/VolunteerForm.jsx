import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaCheckCircle, FaUserPlus } from "react-icons/fa";
import api from "../utils/api";
import { useVolunteerAuth } from "../context/VolunteerAuthContext";
import { validatePhone, sanitizePhone } from "../utils/validation";

const DOMAINS = [
  "Education",
  "Healthcare",
  "Environment",
  "Community Development",
  "Other",
];
const AVAILABILITY = ["Weekends", "Weekdays", "Evenings", "Flexible"];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  skills: "",
  preferredDomain: "",
  availability: "",
};

// ── Auth gate ──────────────────────────────────────────────────────────────
function AuthGate() {
  return (
    <div className="glass-card register-auth-gate">
      <div className="register-gate-icon">
        <FaLock />
      </div>
      <h3>Account Required</h3>
      <p className="register-gate-msg">
        Please create an account or login before applying as a volunteer.
      </p>
      <div className="register-gate-actions">
        <Link to="/volunteer/signup" className="btn btn-primary">
          <FaUserPlus />
          Create Account
        </Link>
        <Link
          to="/volunteer/login"
          state={{ returnTo: "/#register" }}
          className="btn btn-outline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

// ── Success state shown after submission ───────────────────────────────────
function SuccessState({ onReset }) {
  return (
    <div className="glass-card register-success-card">
      <div className="register-success-icon">
        <FaCheckCircle />
      </div>
      <h3>Application Submitted!</h3>
      <p className="register-success-msg">
        Thank you for registering as a volunteer. Our team will review your
        application and get back to you soon.
      </p>
      <button
        type="button"
        className="btn btn-outline register-success-btn"
        onClick={onReset}
      >
        Submit Another Application
      </button>
    </div>
  );
}

// ── Registration form ──────────────────────────────────────────────────────
function RegistrationForm() {
  const { volunteer } = useVolunteerAuth();

  // Always start empty — no pre-fill, no stale data on refresh
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reset to initial empty state
  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setServerError("");
    setSubmitted(false);
  };

  if (submitted) {
    return <SuccessState onReset={handleReset} />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: strip non-digits and cap at 10
    if (name === "phone") {
      const sanitized = sanitizePhone(value);
      setFormData((prev) => ({ ...prev, phone: sanitized }));
      // Live validation feedback
      const err = validatePhone(sanitized);
      setFieldErrors((prev) => ({ ...prev, phone: err }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.college.trim()) errors.college = "College is required";
    if (!formData.skills.trim()) errors.skills = "Skills are required";
    if (!formData.preferredDomain) errors.preferredDomain = "Please select a domain";
    if (!formData.availability) errors.availability = "Please select availability";

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errors.phone = phoneErr;

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      const firstErr = document.querySelector(".v-field-error");
      if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/volunteers/register", {
        ...formData,
        email: volunteer?.email || formData.email,
      });
      setSubmitted(true);
      // Scroll success card into view
      window.scrollTo({ top: document.getElementById("register")?.offsetTop ?? 0, behavior: "smooth" });
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card register-form-wrapper">
      <div className="register-form-header">
        <h3>Volunteer Registration Form</h3>
        <p className="register-form-subtitle">
          Logged in as <strong>{volunteer?.email}</strong>
        </p>
      </div>

      {serverError && (
        <div className="admin-alert admin-alert-error">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Row 1 */}
        <div className="form-row">
          <div className={`form-group ${fieldErrors.fullName ? "form-group--error" : ""}`}>
            <label htmlFor="reg-fullName">Full Name</label>
            <input
              id="reg-fullName"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
            {fieldErrors.fullName && (
              <span className="v-field-error">{fieldErrors.fullName}</span>
            )}
          </div>

          <div className={`form-group ${fieldErrors.email ? "form-group--error" : ""}`}>
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className="v-field-error">{fieldErrors.email}</span>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="form-row">
          <div className={`form-group ${fieldErrors.phone ? "form-group--error" : ""}`}>
            <label htmlFor="reg-phone">
              Phone Number
              <span className="v-field-hint">10 digits only</span>
            </label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
            />
            {fieldErrors.phone ? (
              <span className="v-field-error">{fieldErrors.phone}</span>
            ) : (
              <span className="v-field-counter">{formData.phone.length}/10</span>
            )}
          </div>

          <div className={`form-group ${fieldErrors.college ? "form-group--error" : ""}`}>
            <label htmlFor="reg-college">College / Institution</label>
            <input
              id="reg-college"
              type="text"
              name="college"
              placeholder="Your institution"
              value={formData.college}
              onChange={handleChange}
            />
            {fieldErrors.college && (
              <span className="v-field-error">{fieldErrors.college}</span>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className={`form-group ${fieldErrors.skills ? "form-group--error" : ""}`}>
          <label htmlFor="reg-skills">Skills</label>
          <input
            id="reg-skills"
            type="text"
            name="skills"
            placeholder="e.g. Teaching, First Aid, Communication"
            value={formData.skills}
            onChange={handleChange}
          />
          {fieldErrors.skills && (
            <span className="v-field-error">{fieldErrors.skills}</span>
          )}
        </div>

        {/* Row 3 */}
        <div className="form-row">
          <div className={`form-group ${fieldErrors.preferredDomain ? "form-group--error" : ""}`}>
            <label htmlFor="reg-domain">Preferred Domain</label>
            <select
              id="reg-domain"
              name="preferredDomain"
              value={formData.preferredDomain}
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
            <label htmlFor="reg-availability">Availability</label>
            <select
              id="reg-availability"
              name="availability"
              value={formData.availability}
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
          className="btn btn-accent register-submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="v-btn-spinner" />
              Submitting…
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function VolunteerForm() {
  const { isAuthenticated, loading } = useVolunteerAuth();

  return (
    <section className="section register-section" id="register">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Join Our Mission</span>
          <h2 className="section-title">Volunteer Registration</h2>
          <p className="section-subtitle">
            {isAuthenticated
              ? "Fill in the form below to submit your volunteer application."
              : "Create a free account or login to access the volunteer registration form."}
          </p>
        </div>

        {/* Suppress flash during context hydration */}
        {!loading && (isAuthenticated ? <RegistrationForm /> : <AuthGate />)}
      </div>
    </section>
  );
}

export default VolunteerForm;
