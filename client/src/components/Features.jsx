import {
  FaGraduationCap,
  FaHandHoldingHeart,
  FaLeaf,
  FaUsersCog,
  FaAward,
  FaChartLine,
} from "react-icons/fa";

const features = [
  {
    icon: <FaGraduationCap />,
    title: "Education Programs",
    description:
      "Support underprivileged students with tutoring, mentorship, and scholarship guidance to unlock their full potential.",
  },
  {
    icon: <FaHandHoldingHeart />,
    title: "Healthcare Initiatives",
    description:
      "Organize health camps, blood drives, and awareness campaigns to improve community wellness and access to care.",
  },
  {
    icon: <FaLeaf />,
    title: "Environmental Action",
    description:
      "Participate in tree planting, clean-up drives, and sustainability workshops to protect our planet for future generations.",
  },
  {
    icon: <FaUsersCog />,
    title: "Skill Development",
    description:
      "Gain hands-on experience, leadership skills, and professional networking through structured volunteer programs.",
  },
  {
    icon: <FaAward />,
    title: "Recognition & Certificates",
    description:
      "Earn verified certificates and awards that acknowledge your dedication and boost your personal and professional profile.",
  },
  {
    icon: <FaChartLine />,
    title: "Track Your Impact",
    description:
      "Monitor your volunteer hours, projects completed, and the real difference you are making in communities.",
  },
];

function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">What We Offer</span>
          <h2 className="section-title">Programs Built for Impact</h2>
          <p className="section-subtitle">
            Discover diverse volunteering opportunities designed to match your
            skills, passion, and availability.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`glass-card feature-card animate-fade-up animate-fade-up-delay-${(index % 3) + 1}`}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
