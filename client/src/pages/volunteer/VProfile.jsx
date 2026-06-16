import { useState, useEffect } from "react";
import { FaSave, FaUserCircle } from "react-icons/fa";
import VNavbar from "../../components/volunteer/VNavbar";
import { useVolunteerAuth } from "../../context/VolunteerAuthContext";
import api from "../../utils/api";
import { validatePhone, sanitizePhone } from "../../utils/validation";

const DOMAINS = [
  "Education",
  "Healthcare",
  "Environment",
  "Community Development",
  "Other",
];
const AVAILABILITY = ["Weekends", "Weekdays", "Evenings", "Flexible"];

function VProfile() {
  const { refreshVolunteer } = useVolunteerAuth();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch full profile from server (includes fields not in the slim JWT payload)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/volunteers/profile");
        const vol = res.data.volunteer;
        setProfile(vol);
        setForm({
          fullName: vol.fullName || "",
          phone: vol.phone || "",
          college: vol.college || "",
          skills: vol.skills || "",
          preferredDomain: vol.preferredDomain || "",
          availability: vol.availability || "",
          bio: vol.bio || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Phone validation before submit
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) {
      setFieldErrors((prev) => ({ ...prev, phone: phoneErr }));
      return;
    }

    setSaving(true);

    try {
      await api.put("/api/volunteers/profile", form);
      setSuccess("Profile updated successfully!");
      // Keep the volunteer context (name etc.) in sync
      await refreshVolunteer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="v-page">
        <div className="page-bg" />
        <VNavbar />
        <div className="v-loading-screen">
          <div className="v-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="v-page">
      <div className="page-bg" />
      <VNavbar />

      <main className="v-main container">
        {/* Header */}
        <div className="glass-card v-profile-header-card">
          <FaUserCircle className="v-profile-avatar" />
          <div>
            <h1 className="v-welcome-title">{profile?.fullName}</h1>
            <p className="v-welcome-sub">{profile?.email}</p>
          </div>
          <span
            className={`v-status-badge v-status-badge--${
              profile?.status || "active"
            }`}
          >
            {profile?.status || "active"}
          </span>
        </div>

        {/* Read-only info */}
        <div className="glass-card v-profile-meta-card">
          <div className="v-profile-meta-row">
            <span className="v-profile-meta-label">Email</span>
            <span className="v-profile-meta-value">{profile?.email}</span>
          </div>
          <div className="v-profile-meta-row">
            <span className="v-profile-meta-label">Member Since</span>
            <span className="v-profile-meta-value">
              {new Date(profile?.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="v-profile-meta-row">
            <span className="v-profile-meta-label">Total Hours</span>
            <span className="v-profile-meta-value">
              {profile?.totalHours ?? 0}
            </span>
          </div>
        </div>

        {/* Editable form */}
        <div className="glass-card v-profile-form-card">
          <h2 className="v-section-title">Edit Profile</h2>

          {error && (
            <div className="admin-alert admin-alert-error">{error}</div>
          )}
          {success && (
            <div className="admin-alert admin-alert-success">{success}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Row 1 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="p-fullName">Full Name</label>
                <input
                  id="p-fullName"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`form-group ${fieldErrors.phone ? "form-group--error" : ""}`}>
                <label htmlFor="p-phone">
                  Phone Number
                  <span className="v-field-hint">10 digits only</span>
                </label>
                <input
                  id="p-phone"
                  type="tel"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="9876543210"
                />
                {fieldErrors.phone ? (
                  <span className="v-field-error">{fieldErrors.phone}</span>
                ) : (
                  <span className="v-field-counter">{(form.phone || "").length}/10</span>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="p-college">College / Institution</label>
                <input
                  id="p-college"
                  type="text"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="p-skills">Skills</label>
                <input
                  id="p-skills"
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="p-domain">Preferred Domain</label>
                <select
                  id="p-domain"
                  name="preferredDomain"
                  value={form.preferredDomain}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a domain
                  </option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="p-availability">Availability</label>
                <select
                  id="p-availability"
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select availability
                  </option>
                  {AVAILABILITY.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label htmlFor="p-bio">
                Bio{" "}
                <span className="v-optional">(optional, max 500 chars)</span>
              </label>
              <textarea
                id="p-bio"
                name="bio"
                rows={4}
                placeholder="Tell us a bit about yourself and your volunteering goals..."
                value={form.bio}
                onChange={handleChange}
                maxLength={500}
                className="v-textarea"
              />
              <span className="v-char-count">
                {form.bio.length} / 500
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary v-save-btn"
              disabled={saving}
            >
              <FaSave />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default VProfile;
