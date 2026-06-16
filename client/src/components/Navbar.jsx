import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useVolunteerAuth } from "../context/VolunteerAuthContext";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Impact", href: "#stats" },
  { label: "Features", href: "#features" },
  { label: "Stories", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const { isAuthenticated } = useVolunteerAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container navbar-inner">
          <a href="#home" className="navbar-brand">
            <span className="navbar-brand-icon">V</span>
            VolunteerHub
          </a>

          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}

            {/* Always scrolls to #register — the section handles auth gate */}
            <li className="navbar-cta">
              <a href="#register" className="btn btn-primary">
                Join Us
              </a>
            </li>

            <li className="navbar-cta">
              {isAuthenticated ? (
                <Link
                  to="/volunteer/dashboard"
                  className="btn btn-outline navbar-volunteer-btn"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  to="/volunteer/login"
                  className="btn btn-outline navbar-volunteer-btn"
                >
                  Volunteer Login
                </Link>
              )}
            </li>
          </ul>

          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}

        <a href="#register" className="btn btn-primary" onClick={closeMenu}>
          Join Us
        </a>

        {isAuthenticated ? (
          <Link
            to="/volunteer/dashboard"
            className="btn btn-outline"
            onClick={closeMenu}
          >
            My Dashboard
          </Link>
        ) : (
          <Link
            to="/volunteer/login"
            className="btn btn-outline"
            onClick={closeMenu}
          >
            Volunteer Login
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;
