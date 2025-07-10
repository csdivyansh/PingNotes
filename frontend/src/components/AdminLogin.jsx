import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api.js";

const ACCENT_COLOR = "#a259ff"; // Modern purple
const BG_COLOR = "#181824";
const CARD_COLOR = "#232336";
const TEXT_COLOR = "#f3f3f7";
const ERROR_COLOR = "#ff4d6d";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await apiService.adminLogin(email, password);
      setSuccess(true);
      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }
      if (onLogin) onLogin(data);
      // Redirect to admin dashboard after login
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <form style={styles.card} onSubmit={handleSubmit} autoComplete="off">
        {/* Logo Placeholder */}
        <div style={styles.logoCircle}>
          <span style={styles.logoText}>PN</span>
        </div>
        <h2 style={styles.title}>Admin Login</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            style={styles.input}
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">Password</label>
          <input
            style={styles.input}
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>Login successful! Redirecting...</div>}
        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: BG_COLOR,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: CARD_COLOR,
    padding: "2.5rem 2rem 2rem 2rem",
    borderRadius: "1.2rem",
    boxShadow: "0 4px 32px 0 rgba(0,0,0,0.25)",
    minWidth: 320,
    maxWidth: 360,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: ACCENT_COLOR,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    boxShadow: "0 2px 12px 0 rgba(162,89,255,0.25)",
  },
  logoText: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 28,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  title: {
    color: TEXT_COLOR,
    fontWeight: 600,
    fontSize: 24,
    marginBottom: 24,
    marginTop: 0,
    letterSpacing: 1,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 18,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: TEXT_COLOR,
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 500,
    letterSpacing: 0.5,
  },
  input: {
    padding: "0.7rem 1rem",
    borderRadius: 8,
    border: "none",
    outline: "none",
    background: "#1e1e2f",
    color: TEXT_COLOR,
    fontSize: 16,
    marginBottom: 2,
    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.08)",
    transition: "background 0.2s",
  },
  button: {
    width: "100%",
    padding: "0.8rem 0",
    borderRadius: 8,
    border: "none",
    background: ACCENT_COLOR,
    color: "#fff",
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: 1,
    marginTop: 8,
    boxShadow: "0 2px 8px 0 rgba(162,89,255,0.18)",
    transition: "background 0.2s, opacity 0.2s",
  },
  error: {
    color: ERROR_COLOR,
    background: "rgba(255,77,109,0.08)",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 14,
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
  },
  success: {
    color: ACCENT_COLOR,
    background: "rgba(162,89,255,0.08)",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 14,
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
  },
}; 