import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Education Volunteer, Delhi",
    initials: "PS",
    text: "Volunteering with VolunteerHub changed my perspective on community service. The structured programs and supportive team made it easy to contribute meaningfully while balancing my college schedule.",
  },
  {
    name: "Arjun Mehta",
    role: "Healthcare Coordinator, Mumbai",
    initials: "AM",
    text: "I've been part of three health camps so far. Seeing the direct impact on people's lives is incredibly rewarding. This organization truly values every volunteer's time and effort.",
  },
  {
    name: "Sneha Reddy",
    role: "Environmental Lead, Bangalore",
    initials: "SR",
    text: "From tree plantation drives to awareness workshops, the environmental initiatives here are well-organized and impactful. I gained leadership skills I never thought I had.",
  },
];

function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Volunteer Stories</span>
          <h2 className="section-title">Hear From Our Community</h2>
          <p className="section-subtitle">
            Real stories from volunteers who are making a difference in their
            communities every day.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div
              key={item.name}
              className={`glass-card testimonial-card animate-fade-up animate-fade-up-delay-${index + 1}`}
            >
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <div className="testimonial-quote">&ldquo;</div>
              <p className="testimonial-text">{item.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{item.initials}</div>
                <div>
                  <div className="testimonial-name">{item.name}</div>
                  <div className="testimonial-role">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
