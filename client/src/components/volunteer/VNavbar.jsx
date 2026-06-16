import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaSignOutAlt } from "react-icons/fa";
import { useVolunteerAuth } from "../../context/VolunteerAuthContext";

const navLinks = [
  { label: "Dashboard", to: "/volunteer/dashboard" },
  { label: "Profile", to: "/volunteer/profile" },
];

function VNavbar() {
  const { volunteer, logout } = useVolunteerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/volunteer/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="v-navbar">
        <div className="container v-navbar-inner">
          {/* Brand */}
          <Link to="/volunteer/dashboard" className="v-navbar-brand">
            <span className="navbar-brand-icon">V</span>
            VolunteerHub
          </Link>

          {/* Desktop links */}
          <ul className="v-navbar-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={isActive(link.to) ? "v-nav-active" : ""}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right side */}
          <div className="v-navbar-right">
            <span className="v-navbar-user">
              {volunteer?.fullName || volunteer?.email}
            </span>
            <button
              type="button"
              className="btn btn-outline v-logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
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
      <div className={`v-mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={isActive(link.to) ? "v-nav-active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );
}

export default VNavbar;
