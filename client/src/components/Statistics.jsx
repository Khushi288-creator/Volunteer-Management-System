import { useState, useEffect } from "react";
import { FaUsers, FaGlobeAmericas, FaClock, FaHeart } from "react-icons/fa";
import api from "../utils/api";

/**
 * Format a raw number into a compact display string.
 * e.g.  0 → "0"  |  47 → "47"  |  1500 → "1,500+"  |  85000 → "85K+"
 */
function formatCount(n) {
  if (!n || n === 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K+`;
  return `${n}+`;
}

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/public/stats")
      .then((res) => {
        if (!cancelled) setStats(res.data.stats);
      })
      .catch(() => {
        // On error keep stats null — fallback values will render
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Stat card definitions.
   * value:    real value from API (null while loading → shows skeleton)
   * fallback: shown if API call failed entirely
   * future:   true = this metric is Phase 2+ (shows 0 today)
   */
  const cards = [
    {
      icon: <FaUsers />,
      label: "Registered Volunteers",
      value: stats?.totalVolunteers ?? null,
      fallback: "—",
      future: false,
    },
    {
      icon: <FaGlobeAmericas />,
      label: "Applications Submitted",
      value: stats?.totalApplications ?? null,
      fallback: "—",
      future: true,
    },
    {
      icon: <FaClock />,
      label: "Hours Contributed",
      value: stats?.totalHours ?? null,
      fallback: "—",
      future: true,
    },
    {
      icon: <FaHeart />,
      label: "Certificates Issued",
      value: stats?.certificatesIssued ?? null,
      fallback: "—",
      future: true,
    },
  ];

  return (
    <section className="section" id="stats">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Our Impact</span>
          <h2 className="section-title">Numbers That Tell Our Story</h2>
          <p className="section-subtitle">
            Every volunteer hour creates ripples of change. Here is the
            collective impact our community has achieved so far.
          </p>
        </div>

        <div className="stats-grid">
          {cards.map((card, index) => (
            <div
              key={card.label}
              className={`glass-card stat-card animate-fade-up animate-fade-up-delay-${index + 1}`}
            >
              <div className="stat-icon">{card.icon}</div>

              {loading ? (
                <div className="stat-value stat-skeleton" aria-hidden="true" />
              ) : (
                <div className="stat-value">
                  {stats ? formatCount(card.value) : card.fallback}
                </div>
              )}

              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
