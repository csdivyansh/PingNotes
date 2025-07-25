import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import pnLogo from "../assets/pn_logo.png";

const Logo = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div
      style={{
        fontWeight: 800,
        fontSize: 24,
        color: "#0a192f",
        fontFamily: "Raleway, sans-serif",
        fontStyle: "normal",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1)" : "scale(0.9)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        userSelect: "none",
      }}
    >
      Pingnotes
    </div>
  );
};

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

  // Close menu if route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
        role="navigation"
        aria-label="Primary"
      >
        <div className="navbar-container">
          <Logo />
          <button
            className={`navbar-hamburger${menuOpen ? " open" : ""}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={handleMenuToggle}
          >
            <span className="hamburger-bar bar1" />
            <span className="hamburger-bar bar2" />
            <span className="hamburger-bar bar3" />
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
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* CSS Styling */}
      <style>{`
        .navbar-container {
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          padding: 20px 32px 12px 32px;
          position: relative;
          user-select: none;
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
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .navbar-links a {
          color: #0a192f;
          text-decoration: none;
          font-weight: 700;
          font-size: 18px;
          font-family: Poppins, Arial, sans-serif;
          transition:
            color 0.2s,
            border-bottom-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 3px solid transparent;
          padding-bottom: 4px;
          user-select: text;
        }
        .navbar-links a:hover,
        .navbar-links a:focus {
          color: #0078FF;
          border-bottom-color: #0078FF;
          outline: none;
        }
        .navbar-links a.active {
          color: #0078FF;
          border-bottom-color: #0078FF;
          font-weight: 800;
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
          transition:
            background 0.3s cubic-bezier(0.4,0,0.2,1),
            transform 0.2s ease,
            box-shadow 0.3s ease;
          margin-left: 16px;
          user-select: none;
        }
        .navbar-btn:hover,
        .navbar-btn:focus-visible {
          background: #0056b3;
          transform: scale(1.07);
          box-shadow: 0 4px 16px rgba(0,100,255,0.3);
          outline-offset: 3px;
        }

        /* Hamburger button and bars */
        .navbar-hamburger {
          display: none;
          position: relative;
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
          transition: transform 0.25s ease;
          z-index: 1100;
        }
        .hamburger-bar {
          width: 28px;
          height: 3px;
          background: #0a192f;
          margin: 4px 0;
          border-radius: 2px;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          transform-origin: center;
        }

        /* Animate hamburger to X */
        .navbar-hamburger.open .bar1 {
          transform: rotate(45deg) translate(6px, 6px);
        }
        .navbar-hamburger.open .bar2 {
          opacity: 0;
        }
        .navbar-hamburger.open .bar3 {
          transform: rotate(-45deg) translate(6px, -6px);
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
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
            transition:
              max-height 0.4s cubic-bezier(0.4,0,0.2,1),
              opacity 0.35s ease,
              padding 0.35s ease;
            z-index: 1001;
          }
          .navbar-links.open {
            max-height: 450px; /* big enough to show all links + button */
            opacity: 1;
            padding: 16px 0 12px 0;
            pointer-events: auto;
          }
          .navbar-links a {
            width: 100%;
            padding: 14px 32px;
            font-size: 18px;
            border-radius: 0;
            margin: 0;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
            box-sizing: border-box;
            opacity: 0;
            transform: translateX(-15px);
            animation-fill-mode: forwards;
            animation-duration: 0.28s;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            /* Animation delay staggering */
          }
          /* Stagger the menu items appearing */
          .navbar-links.open a:nth-child(1) {
            animation-name: slideFadeIn;
            animation-delay: 0.05s;
          }
          .navbar-links.open a:nth-child(2) {
            animation-name: slideFadeIn;
            animation-delay: 0.12s;
          }
          .navbar-links.open a:nth-child(3) {
            animation-name: slideFadeIn;
            animation-delay: 0.19s;
          }
          .navbar-links.open a:nth-child(4) {
            animation-name: slideFadeIn;
            animation-delay: 0.26s;
          }
          .navbar-links.open a:nth-child(5) {
            animation-name: slideFadeIn;
            animation-delay: 0.33s;
          }
          .navbar-links.open .navbar-btn-mobile {
            display: block;
            width: 100%;
            padding: 14px 32px;
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
            transition:
              background 0.2s cubic-bezier(0.4,0,0.2,1),
              transform 0.2s ease;
            opacity: 0;
            transform: translateX(-15px);
            animation-fill-mode: forwards;
            animation-duration: 0.31s;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            animation-name: slideFadeIn;
            animation-delay: 0.40s;
          }
          .navbar-links.open .navbar-btn-mobile:hover,
          .navbar-links.open .navbar-btn-mobile:focus-visible {
            background-color: #0056b3;
            transform: scale(1.05);
            outline-offset: 3px;
          }

          @keyframes slideFadeIn {
            from {
              opacity: 0;
              transform: translateX(-15px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .navbar-btn-desktop {
            display: none;
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
