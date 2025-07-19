import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import pnLogo from "../assets/pn_logo.png";
import Navbar from "./Navbar";
import Footer from "./Footer.jsx";
// You can replace this with a logo SVG or image if available
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <span
      style={{
        fontWeight: 700,
        fontSize: 24,
        color: "#0a192f",
        letterSpacing: 1,
      }}
    >
      Pingnotes
    </span>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          background: "#f9fbfd",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        {showBanner && (
          <div
            style={{
              background: "linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)",
              color: "#fff",
              padding: "8px 0",
              textAlign: "center",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            🚀 Welcome!
          </div>
        )}
        <section style={{ alignItems: "center", textAlign: "center" }}>
          <motion.img
            src={pnLogo}
            alt="PingNotes Logo"
            style={{
              width: 200,
              height: 200,
              filter: "drop-shadow(0 0 32px #0078FF55)",
            }}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#0078FF",
              letterSpacing: 2,
              marginBottom: 0,
              lineHeight: 1.1,
            }}
          >
            Ping<span style={{ color: "#0a192f" }}>notes</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#0a192f",
              margin: "12px 0 0 0",
              lineHeight: 1.1,
            }}
          >
            Notes Organisation{" "}
            <span style={{ color: "#0078FF" }}>Simplified</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{
              fontSize: 18,
              color: "#222",
              margin: "20px auto 0 auto",
              maxWidth: 700,
              fontWeight: 400,
            }}
          >
            Organise, search, and access your notes with ease. Pingnotes helps
            you keep your study and work materials structured, accessible, and
            always at your fingertips.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ display: "inline-block" }}
          >
            <Link
              to="/plans"
              style={{
                display: "inline-block",
                marginTop: 30,
                background: "#0078FF",
                color: "#fff",
                padding: "16px 48px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 22,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(0,120,255,0.10)",
              }}
            >
              Get Started <span style={{ fontSize: 26, marginLeft: 8 }}>→</span>
            </Link>
          </motion.div>
        </section>
      </div>
      <Footer className="fixed-footer" />
      <style>{`
        .fixed-footer {
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          z-index: 100;
        }
      `}</style>
    </>
  );
};

export default Home;
