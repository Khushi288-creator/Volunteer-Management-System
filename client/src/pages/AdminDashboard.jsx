import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSync } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import StatsCards from "../components/admin/StatsCards";
import SearchBar from "../components/admin/SearchBar";
import VolunteerTable from "../components/admin/VolunteerTable";
import VolunteerDetailsModal from "../components/admin/VolunteerDetailsModal";

function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (searchTerm = "") => {
    try {
      setError("");
      const [statsRes, volunteersRes] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/admin/volunteers", {
          params: searchTerm ? { search: searchTerm } : {},
        }),
      ]);

      setStats(statsRes.data.stats);
      setVolunteers(volunteersRes.data.volunteers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    load();
  }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) fetchData(search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, loading, fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(search);
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleDelete = async (volunteer) => {
    const confirmed = window.confirm(
      `Delete ${volunteer.fullName}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(volunteer._id);
    try {
      await api.delete(`/api/admin/volunteers/${volunteer._id}`);
      await fetchData(search);
      if (selectedVolunteer?._id === volunteer._id) {
        setSelectedVolunteer(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete volunteer");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-bg" />

      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-header-brand">
            <span className="navbar-brand-icon">V</span>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {admin?.name || admin?.email}</p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="btn btn-outline admin-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FaSync className={refreshing ? "spinning" : ""} />
              Refresh
            </button>
            <button
              type="button"
              className="btn btn-outline admin-logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main container">
        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <StatsCards stats={stats} />

        {stats?.domainBreakdown?.length > 0 && (
          <div className="glass-card admin-domain-card">
            <h3>Domain Statistics</h3>
            <div className="admin-domain-bars">
              {stats.domainBreakdown.map((item) => {
                const pct =
                  stats.totalVolunteers > 0
                    ? Math.round((item.count / stats.totalVolunteers) * 100)
                    : 0;
                return (
                  <div key={item.domain} className="admin-domain-row">
                    <div className="admin-domain-info">
                      <span>{item.domain}</span>
                      <span>
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="admin-domain-bar-track">
                      <div
                        className="admin-domain-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats?.recentRegistrations?.length > 0 && (
          <div className="glass-card admin-recent-card">
            <h3>Recent Registrations</h3>
            <ul className="admin-recent-list">
              {stats.recentRegistrations.map((v) => (
                <li key={v._id}>
                  <div>
                    <strong>{v.fullName}</strong>
                    <span>{v.email}</span>
                  </div>
                  <span className="admin-domain-badge">{v.preferredDomain}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="admin-volunteers-section">
          <div className="admin-section-header">
            <h2>All Volunteers</h2>
            <span className="admin-count-badge">{volunteers.length} total</span>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />

          <VolunteerTable
            volunteers={volunteers}
            onView={setSelectedVolunteer}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        </div>
      </main>

      {selectedVolunteer && (
        <VolunteerDetailsModal
          volunteer={selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
