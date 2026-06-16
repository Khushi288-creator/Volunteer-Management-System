import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const footerLinks = {
  Programs: [
    { label: "Education", href: "#features" },
    { label: "Healthcare", href: "#features" },
    { label: "Environment", href: "#features" },
    { label: "Community", href: "#features" },
  ],
  Organization: [
    { label: "About Us", href: "#home" },
    { label: "Our Impact", href: "#stats" },
    { label: "Volunteer Stories", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ],
  "Get Involved": [
    { label: "Register", href: "#register" },
    { label: "Partner With Us", href: "#contact" },
    { label: "Donate", href: "#contact" },
    { label: "Events", href: "#features" },
  ],
};

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="navbar-brand">
              <span className="navbar-brand-icon">V</span>
              VolunteerHub
            </a>
            <p>
              Empowering communities through volunteer action. Together, we
              create lasting change across education, health, and the
              environment.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="footer-heading">{heading}</h4>
              <ul className="footer-links">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} VolunteerHub. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="/admin/login">Admin</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
