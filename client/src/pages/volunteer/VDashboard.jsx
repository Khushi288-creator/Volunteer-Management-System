import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaClock,
  FaClipboardList,
  FaTasks,
  FaCertificate,
} from "react-icons/fa";
import VNavbar from "../../components/volunteer/VNavbar";
import { useVolunteerAuth } from "../../context/VolunteerAuthContext";
import api from "../../utils/api";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StatCard({ icon, label, value, hint, color }) {
  return (
    <div className={`glass-card v-stat-card v-stat-card--${color}`}>
      <div className={`v-stat-icon v-stat-icon--${color}`}>{icon}</div>
      <div className="v-stat-content">
        <span className="v-stat-label">{label}</span>
        <span className="v-stat-value">{value}</span>
        {hint && <span className="v-stat-hint">{hint}</span>}
      </div>
    </div>
  );
}

function VDashboard() {
  const { volunteer } = useVolunteerAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/volunteers/dashboard/stats");
        setStats(res.data.stats);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="v-page">
      <div className="page-bg" />
      <VNavbar />

      <main className="v-main container">
        {/* Welcome banner */}
        <div className="glass-card v-welcome-card">
          <div className="v-welcome-left">
            <FaUserCircle className="v-welcome-avatar" />
            <div>
              <h1 className="v-welcome-title">
                Welcome back,{" "}
                <span>{volunteer?.fullName || "Volunteer"}</span>
              </h1>
              <p className="v-welcome-sub">
                {volunteer?.preferredDomain
                  ? `${volunteer.preferredDomain} volunteer`
                  : "Volunteer"}
                {stats?.memberSince
                  ? ` · Member since ${formatDate(stats.memberSince)}`
                  : ""}
              </p>
            </div>
          </div>
          <span className={`v-status-badge v-status-badge--${stats?.status || "active"}`}>
            {stats?.status || "active"}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="admin-alert admin-alert-error">{error}</div>
        )}

        {/* Stats grid */}
        {loading ? (
          <div className="v-loading-screen">
            <div className="v-spinner" />
            <p>Loading your stats...</p>
          </div>
        ) : (
          <div className="v-stats-grid">
            <StatCard
              icon={<FaClock />}
              label="Total Hours"
              value={stats?.totalHours ?? 0}
              hint="Volunteered so far"
              color="teal"
            />
            <StatCard
              icon={<FaClipboardList />}
              label="Applications"
              value={stats?.applications ?? 0}
              hint="Opportunities applied"
              color="gold"
            />
            <StatCard
              icon={<FaTasks />}
              label="Active Tasks"
              value={stats?.activeTasks ?? 0}
              hint="Pending completion"
              color="blue"
            />
            <StatCard
              icon={<FaCertificate />}
              label="Certificates"
              value={stats?.certificates ?? 0}
              hint="Issued to you"
              color="purple"
            />
          </div>
        )}

        {/* Quick links */}
        <div className="glass-card v-quick-links-card">
          <h2 className="v-section-title">Quick Actions</h2>
          <div className="v-quick-links">
            <a href="/volunteer/profile" className="v-quick-link">
              <FaUserCircle />
              <span>Edit Profile</span>
            </a>
          </div>
          <p className="v-coming-soon">
            More features — opportunities, tasks, and certificates — are coming
            in the next phases.
          </p>
        </div>
      </main>
    </div>
  );
}

export default VDashboard;
