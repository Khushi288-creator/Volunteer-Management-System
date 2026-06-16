import { FaUsers, FaUserPlus, FaChartPie } from "react-icons/fa";

function StatsCards({ stats }) {
  if (!stats) return null;

  const topDomain = stats.domainBreakdown?.[0];

  return (
    <div className="admin-stats-grid">
      <div className="glass-card admin-stat-card">
        <div className="admin-stat-icon admin-stat-icon-teal">
          <FaUsers />
        </div>
        <div className="admin-stat-content">
          <span className="admin-stat-label">Total Volunteers</span>
          <span className="admin-stat-value">{stats.totalVolunteers}</span>
        </div>
      </div>

      <div className="glass-card admin-stat-card">
        <div className="admin-stat-icon admin-stat-icon-gold">
          <FaUserPlus />
        </div>
        <div className="admin-stat-content">
          <span className="admin-stat-label">Recent Registrations</span>
          <span className="admin-stat-value">
            {stats.recentRegistrations?.length || 0}
          </span>
          <span className="admin-stat-hint">Last 5 sign-ups</span>
        </div>
      </div>

      <div className="glass-card admin-stat-card">
        <div className="admin-stat-icon admin-stat-icon-purple">
          <FaChartPie />
        </div>
        <div className="admin-stat-content">
          <span className="admin-stat-label">Top Domain</span>
          <span className="admin-stat-value admin-stat-value-sm">
            {topDomain?.domain || "—"}
          </span>
          <span className="admin-stat-hint">
            {topDomain ? `${topDomain.count} volunteers` : "No data yet"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
