import { FaHandsHelping } from "react-icons/fa";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-glow" />
      <div className="hero-glow-2" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-badge animate-fade-up">
            <span className="hero-badge-dot" />
            Making a Difference Together
          </div>

          <h1 className="animate-fade-up animate-fade-up-delay-1">
            Empowering Volunteers for{" "}
            <span>Social Impact</span>
          </h1>

          <p className="hero-description animate-fade-up animate-fade-up-delay-2">
            Join our community of changemakers and contribute towards meaningful
            change through volunteering opportunities across education, health,
            and community development.
          </p>

          <div className="hero-actions animate-fade-up animate-fade-up-delay-3">
            {/* Always scrolls to #register — the section handles auth gate */}
            <a href="#register" className="btn btn-primary">
              Register Now
            </a>
            <a href="#features" className="btn btn-outline">
              Learn More
            </a>
          </div>

          <div className="hero-stats-row animate-fade-up animate-fade-up-delay-4">
            <div className="hero-stat">
              <span className="hero-stat-value">2,500+</span>
              <span className="hero-stat-label">Active Volunteers</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">120+</span>
              <span className="hero-stat-label">Communities Served</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">50K+</span>
              <span className="hero-stat-label">Lives Impacted</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit">
            <div className="hero-orbit-ring" />
            <div className="hero-orbit-ring" />
            <div className="hero-orbit-center">
              <FaHandsHelping />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
