import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import pnLogo from "../assets/pn_logo.png";
import Navbar from "./Navbar";
import Footer from "./Footer.jsx";

const Home = () => {
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
          width: "100vw",
          display: "flex",
          flexDirection: "column",
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
        <section
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.img
            src={pnLogo}
            alt="PingNotes Logo"
            style={{
              width: "clamp(120px, 25vw, 200px)",
              height: "clamp(120px, 25vw, 200px)",
              filter: "drop-shadow(0 0 32px #0078FF55)",
              marginTop: "20px",
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
              fontSize: "clamp(40px, 10vw, 72px)",
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
              fontSize: "clamp(20px, 5vw, 30px)",
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
              fontSize: "clamp(16px, 3vw, 18px)",
              color: "#222",
              margin: "20px auto 0 auto",
              maxWidth: 700,
              fontWeight: 400,
              padding: "0 15px",
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
                fontSize: "clamp(18px, 4vw, 22px)",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(0,120,255,0.10)",
              }}
            >
              Get Started{" "}
              <span
                style={{ fontSize: "clamp(20px, 5vw, 26px)", marginLeft: 8 }}
              >
                →
              </span>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Home;
