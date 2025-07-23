import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import pnLogo from "../assets/pn_logo.png";

const Logo = () => (
  <div style={{ marginRight: 100 }}>
    <span
      style={{
        fontWeight: 800,
        fontSize: 24,
        color: "#0a192f",
        fontFamily: "Raleway, sans-serif",
        fontStyle: "normal",
      }}
    >
      Pingnotes
    </span>
  </div>
);

function isLoggedIn() {
  return !!(
    localStorage.getItem("userToken") || localStorage.getItem("adminToken")
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          width: "100%",
          fontFamily: "Poppins, Arial, sans-serif",
        }}
      >
        <div className="navbar-container">
          <Logo />
          <button
            className="navbar-hamburger"
            aria-label="Toggle navigation menu"
            onClick={handleMenuToggle}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
          <div
            className={`navbar-links${menuOpen ? " open" : ""}`}
            onClick={handleNavClick}
          >
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              to="/features"
              className={location.pathname === "/features" ? "active" : ""}
            >
              Features
            </Link>
            <Link
              to="/plans"
              className={location.pathname === "/plans" ? "active" : ""}
            >
              Plans
            </Link>
            <Link
              to="/faq"
              className={location.pathname === "/faq" ? "active" : ""}
            >
              FAQs
            </Link>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
            >
              About
            </Link>
            {/* Mobile button inside hamburger */}
            <button
              className="navbar-btn navbar-btn-mobile"
              onClick={() => navigate(loggedIn ? "/dashboard" : "/login")}
              type="button"
            >
              {loggedIn ? "Dashboard" : "Login / Register"}
            </button>
          </div>
          {/* Desktop button */}
          <div className="navbar-btn-desktop">
            {loggedIn ? (
              <button
                className="navbar-btn"
                onClick={() => navigate("/dashboard")}
                type="button"
              >
                Dashboard
              </button>
            ) : (
              <button
                className="navbar-btn"
                onClick={() => navigate("/login")}
                type="button"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </nav>
      <style>{`
        .navbar-container {
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          padding: 20px 32px 12px 32px;
          position: relative;
        }
        .navbar-links {
          display: flex;
          gap: 32px;
          align-items: center;
          position: static;
          background: none;
          flex-direction: row;
          padding: 0;
          box-shadow: none;
        }
        .navbar-links a {
          color: #0a192f;
          text-decoration: none;
          font-weight: 700;
          font-size: 18px;
          font-family: Poppins, Arial, sans-serif;
          transition: color 0.2s;
        }
        .navbar-links a.active {
          color: #0078FF;
        }
        .navbar-btn {
          background: #0078FF;
          color: #fff;
          padding: 10px 28px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 16px;
          font-family: Poppins, Arial, sans-serif;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,120,255,0.08);
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          margin-left: 16px;
        }
        .navbar-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: 16px;
        }
        .hamburger-bar {
          width: 28px;
          height: 3px;
          background: #0a192f;
          margin: 4px 0;
          border-radius: 2px;
          transition: all 0.3s;
        }
        @media (max-width: 900px) {
          .navbar-container {
            padding: 16px 16px 8px 16px;
          }
          .navbar-links {
            gap: 18px;
          }
        }
        @media (max-width: 768px) {
          .navbar-hamburger {
            display: flex;
          }
          .navbar-links {
            position: absolute;
            top: 100%;
            right: 0;
            left: 0;
            background: #fff;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            padding: 0 0 12px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            display: none;
            z-index: 1001;
          }
          .navbar-links.open {
            display: flex;
          }
          .navbar-links a {
            width: 100%;
            padding: 14px 24px;
            font-size: 18px;
            border-radius: 0;
            margin: 0;
            text-align: left;
          }
          .navbar-btn-desktop {
            display: none;
          }
          .navbar-links.open::after {
            content: '';
          }
          .navbar-links.open .navbar-btn-mobile {
            display: block;
            width: 100%;
            padding: 14px 24px;
            font-size: 18px;
            border-radius: 0;
            margin: 0;
            text-align: left;
            background: #0078FF;
            color: #fff;
            border: none;
            font-weight: 700;
            font-family: Poppins, Arial, sans-serif;
            box-shadow: 0 2px 8px rgba(0,120,255,0.08);
            cursor: pointer;
            transition: background 0.2s;
          }
        }
        @media (min-width: 769px) {
          .navbar-btn-mobile {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .navbar-container {
            padding: 10px 4vw 6px 4vw;
          }
          .navbar-links a, .navbar-btn {
            font-size: 16px;
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
