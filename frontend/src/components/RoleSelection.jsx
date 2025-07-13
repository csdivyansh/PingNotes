import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api.js";

const roles = [
  { label: "Student" },
  { label: "Teacher" },
  { label: "Administrator" },
];

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const buttonDivRef = useRef(null);

  // Check for existing token on component mount
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");

    if (userToken || adminToken) {
      // Validate token by making a simple API call
      validateTokenAndRedirect(userToken || adminToken);
    }
  }, []);

  const validateTokenAndRedirect = async (token) => {
    try {
      // Make a simple API call to validate the token
      const response = await fetch("/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Token is valid, redirect to appropriate dashboard
        const adminToken = localStorage.getItem("adminToken");
        if (adminToken) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("userToken");
        localStorage.removeItem("adminToken");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      // Token validation failed, remove it
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
    }
  };

  useEffect(() => {
    if (
      showModal &&
      buttonDivRef.current &&
      window.google &&
      GOOGLE_CLIENT_ID
    ) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonDivRef.current, {
        theme: "outline",
        size: "large",
      });
      // Optionally show One Tap
      // window.google.accounts.id.prompt();
    }
  }, [showModal]);

  const handleCredentialResponse = async (response) => {
    try {
      // Send the JWT token to backend for verification and login
      const result = await apiService.request("/api/auth/google/onetap", {
        method: "POST",
        body: JSON.stringify({
          credential: response.credential,
          role: selectedRole.toLowerCase(),
        }),
      });

      // Store the token based on role
      if (selectedRole === "Student") {
        localStorage.setItem("userToken", result.token);
        localStorage.setItem("userRole", "user");
      } else if (selectedRole === "Teacher") {
        localStorage.setItem("userToken", result.token);
        localStorage.setItem("userRole", "teacher");
      }

      // Close modal and navigate to dashboard
      setShowModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Login failed. Please try again.");
      setShowModal(false);
    }
  };

  useEffect(() => {
    // Dynamically load the Google Identity Services script if not already present
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        // Script loaded
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleRoleClick = (role) => {
    if (role === "Administrator") {
      navigate("/admin/login");
    } else {
      setSelectedRole(role);
      setShowModal(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ marginBottom: 100, fontSize: 50 }}>You are a......</h2>
      <div style={{ display: "flex", gap: 32 }}>
        {roles.map((role) => (
          <button
            key={role.label}
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "32px 48px",
              fontSize: 18,
              cursor: "pointer",
            }}
            onClick={() => handleRoleClick(role.label)}
          >
            {role.label}
          </button>
        ))}
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem 2.5rem",
              borderRadius: 16,
              boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
              minWidth: 320,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3 style={{ marginBottom: 24 }}>
              Sign in as {selectedRole} with Google
            </h3>
            <div
              ref={buttonDivRef}
              id="buttonDiv"
              style={{ marginBottom: 16 }}
            ></div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "#eee",
                color: "#333",
                border: "none",
                borderRadius: 8,
                padding: "8px 24px",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
