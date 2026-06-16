import { FaUsers, FaGlobeAmericas, FaClock, FaHeart } from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers />,
    value: "2,500+",
    label: "Registered Volunteers",
  },
  {
    icon: <FaGlobeAmericas />,
    value: "120+",
    label: "Communities Reached",
  },
  {
    icon: <FaClock />,
    value: "85,000+",
    label: "Hours Contributed",
  },
  {
    icon: <FaHeart />,
    value: "50K+",
    label: "Lives Transformed",
  },
];

function Statistics() {
  return (
    <section className="section" id="stats">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Our Impact</span>
          <h2 className="section-title">Numbers That Tell Our Story</h2>
          <p className="section-subtitle">
            Every volunteer hour creates ripples of change. Here is the collective
            impact our community has achieved so far.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`glass-card stat-card animate-fade-up animate-fade-up-delay-${index + 1}`}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
