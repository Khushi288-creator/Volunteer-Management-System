import { useState } from "react";
import axios from "axios";

function VolunteerForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    skills: "",
    preferredDomain: "",
    availability: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/volunteers/register",
        formData
      );

      alert(res.data.message);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        college: "",
        skills: "",
        preferredDomain: "",
        availability: "",
      });
    } catch (error) {
      alert("Registration Failed");
      console.log(error);
    }
  };

  return (
    <section className="section register-section" id="register">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Join Our Mission</span>
          <h2 className="section-title">Volunteer Registration</h2>
          <p className="section-subtitle">
            Fill in your details below to become part of our volunteer community.
            We&apos;ll match you with opportunities that fit your skills and schedule.
          </p>
        </div>

        <div className="glass-card register-form-wrapper">
          <h3>Registration Form</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="college">College Name</label>
                <input
                  id="college"
                  type="text"
                  name="college"
                  placeholder="Your institution"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <input
                id="skills"
                type="text"
                name="skills"
                placeholder="e.g. Teaching, First Aid, Communication"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredDomain">Preferred Domain</label>
                <select
                  id="preferredDomain"
                  name="preferredDomain"
                  value={formData.preferredDomain}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a domain
                  </option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Community Development">Community Development</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="availability">Availability</label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select availability
                  </option>
                  <option value="Weekends">Weekends</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Evenings">Evenings</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-accent">
              Submit Registration
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default VolunteerForm;
