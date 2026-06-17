import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  FaUserCircle,
  FaTachometerAlt,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useVolunteerAuth } from "../context/VolunteerAuthContext";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Impact", href: "#stats" },
  { label: "Features", href: "#features" },
  { label: "Stories", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

/** Extract initials from a full name ("Jane Doe" → "JD") */
function initials(name) {
  if (!name) return "V";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

function Navbar() {
  const { isAuthenticated, volunteer, logout } = useVolunteerAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    closeMenu();
    navigate("/");
  };

  const displayName = volunteer?.fullName || volunteer?.email || "Volunteer";

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container navbar-inner">
          {/* Brand */}
          <a href="#home" className="navbar-brand">
            <span className="navbar-brand-icon">V</span>
            VolunteerHub
          </a>

          {/* Desktop links */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}

            {/* Always scrolls to #register */}
            <li className="navbar-cta">
              <a href="#register" className="btn btn-primary">
                Join Us
              </a>
            </li>

            {/* Auth area */}
            <li className="navbar-cta">
              {isAuthenticated ? (
                /* ── Logged-in user menu ─────────────────────────── */
                <div className="nav-user-menu" ref={dropdownRef}>
                  <button
                    type="button"
                    className="nav-user-trigger"
                    onClick={() => setDropdownOpen((o) => !o)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <span className="nav-user-avatar">
                      {initials(volunteer?.fullName)}
                    </span>
                    <span className="nav-user-name">{displayName}</span>
                    <FaChevronDown
                      className={`nav-user-chevron ${dropdownOpen ? "open" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="nav-dropdown glass-card">
                      {/* User info header */}
                      <div className="nav-dropdown-header">
                        <span className="nav-dropdown-name">
                          {volunteer?.fullName || "Volunteer"}
                        </span>
                        <span className="nav-dropdown-email">
                          {volunteer?.email}
                        </span>
                      </div>

                      <div className="nav-dropdown-divider" />

                      <Link
                        to="/volunteer/dashboard"
                        className="nav-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaTachometerAlt />
                        Dashboard
                      </Link>

                      <Link
                        to="/volunteer/profile"
                        className="nav-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaUserCircle />
                        My Profile
                      </Link>

                      <div className="nav-dropdown-divider" />

                      <button
                        type="button"
                        className="nav-dropdown-item nav-dropdown-logout"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Guest login button ──────────────────────────── */
                <Link
                  to="/volunteer/login"
                  className="btn btn-outline navbar-volunteer-btn"
                >
                  Volunteer Login
                </Link>
              )}
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ──────────────────────────────────────────── */}
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
          <>
            {/* Volunteer identity strip */}
            <div className="mobile-user-strip">
              <span className="mobile-user-avatar">
                {initials(volunteer?.fullName)}
              </span>
              <div className="mobile-user-info">
                <span className="mobile-user-name">
                  {volunteer?.fullName || "Volunteer"}
                </span>
                <span className="mobile-user-email">{volunteer?.email}</span>
              </div>
            </div>

            <Link
              to="/volunteer/dashboard"
              className="mobile-menu-item"
              onClick={closeMenu}
            >
              <FaTachometerAlt /> Dashboard
            </Link>
            <Link
              to="/volunteer/profile"
              className="mobile-menu-item"
              onClick={closeMenu}
            >
              <FaUserCircle /> My Profile
            </Link>
            <button
              type="button"
              className="mobile-menu-item mobile-logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
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
