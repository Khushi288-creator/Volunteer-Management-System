import { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Get In Touch</span>
          <h2 className="section-title">We&apos;d Love to Hear From You</h2>
          <p className="section-subtitle">
            Have questions about volunteering or partnering with us? Reach out
            and our team will respond within 24 hours.
          </p>
        </div>

        <div className="contact-wrapper">
          <div className="contact-info">
            <div className="glass-card contact-item">
              <div className="contact-item-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4>Our Office</h4>
                <p>
                  42 Community Drive, Green Park
                  <br />
                  New Delhi, India 110016
                </p>
              </div>
            </div>

            <div className="glass-card contact-item">
              <div className="contact-item-icon">
                <FaEnvelope />
              </div>
              <div>
                <h4>Email Us</h4>
                <p>hello@volunteerhub.org</p>
              </div>
            </div>

            <div className="glass-card contact-item">
              <div className="contact-item-icon">
                <FaPhone />
              </div>
              <div>
                <h4>Call Us</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>

          <form className="glass-card contact-form" onSubmit={handleSubmit}>
            <h3>Send a Message</h3>

            {submitted && (
              <div className="form-success">
                Thank you! Your message has been received. We&apos;ll get back
                to you soon.
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
