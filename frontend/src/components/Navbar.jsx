import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import pnLogo from "../assets/pn_logo.png";

const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <span
      style={{
        fontWeight: 800,
        fontSize: 24,
        color: "#0a192f",
        letterSpacing: 1,
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

  return (
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
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px 12px 32px",
        }}
      >
        <Logo />
        <div style={{ display: "flex", gap: 32 }}>
          <Link
            to="/"
            style={{
              color: location.pathname === "/" ? "#0078FF" : "#0a192f",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
              fontFamily: "Poppins, Arial, sans-serif",
              letterSpacing: 0.5,
              transition: "color 0.2s",
            }}
          >
            Home
          </Link>
          <Link
            to="/features"
            style={{
              color: location.pathname === "/features" ? "#0078FF" : "#0a192f",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
              fontFamily: "Poppins, Arial, sans-serif",
              letterSpacing: 0.5,
              transition: "color 0.2s",
            }}
          >
            Features
          </Link>
          <Link
            to="/plans"
            style={{
              color: location.pathname === "/plans" ? "#0078FF" : "#0a192f",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
              fontFamily: "Poppins, Arial, sans-serif",
              letterSpacing: 0.5,
              transition: "color 0.2s",
            }}
          >
            Plans
          </Link>
          <Link
            to="/faq"
            style={{
              color: location.pathname === "/faq" ? "#0078FF" : "#0a192f",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
              fontFamily: "Poppins, Arial, sans-serif",
              letterSpacing: 0.5,
              transition: "color 0.2s",
            }}
          >
            FAQs
          </Link>
          <Link
            to="/about"
            style={{
              color: location.pathname === "/about" ? "#0078FF" : "#0a192f",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
              fontFamily: "Poppins, Arial, sans-serif",
              letterSpacing: 0.5,
              transition: "color 0.2s",
            }}
          >
            About
          </Link>
        </div>
        {loggedIn ? (
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "#0078FF",
              color: "#fff",
              padding: "10px 28px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              fontFamily: "Poppins, Arial, sans-serif",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,120,255,0.08)",
              border: "none",
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "background 0.2s",
              marginLeft: 16,
            }}
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "#0078FF",
              color: "#fff",
              padding: "10px 28px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              fontFamily: "Poppins, Arial, sans-serif",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,120,255,0.08)",
              border: "none",
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "background 0.2s",
              marginLeft: 16,
            }}
          >
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
