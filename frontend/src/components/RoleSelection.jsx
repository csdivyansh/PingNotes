import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api.js";
import Navbar from "./Navbar";
import Footer from "./Footer.jsx";

const roles = [
  { label: "Student" },
  { label: "Administrator" },
];

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

function RoleSelection() {
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
      // Redirect to backend OAuth endpoint for Google login with Drive access
      const apiBase = import.meta.env.VITE_API_URL || "";
      const rolePath = role === "Teacher" ? "teacher" : "user";
      window.location.href = `${apiBase}/api/auth/google/${rolePath}`;
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="role-selection-main"
        style={{
          minHeight: "85vh",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          className="role-selection-heading"
          style={{ marginBottom: 70, fontSize: 50, textAlign: "center" }}
        >
          You are a/an......
        </h2>
        <div
          className="role-selection-btns"
          style={{ display: "flex", gap: 30 }}
        >
          {roles.map((role) => (
            <button
              key={role.label}
              className="role-btn"
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
        .role-selection-main {
          padding: 0 24px;
        }
        .role-selection-heading {
          font-size: 70px;
        }
        .role-selection-btns {
          display: flex;
          gap: 32px;
        }
        .role-btn {
          background: #000;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 32px 48px;
          font-size: 18px;
          cursor: pointer;
          margin-bottom: 0;
          transition: background 0.2s, color 0.2s;
        }
        @media (max-width: 700px) {
          .role-selection-heading {
            font-size: 36px;
            margin-bottom: 48px;
          }
          .role-selection-btns {
            flex-direction: column;
            gap: 18px;
            width: 100%;
            align-items: center;
          }
          .role-btn {
            width: 100%;
            max-width: 350px;
            padding: 18px 0;
            font-size: 16px;
            margin-bottom: 0;
          }
        }
        @media (max-width: 400px) {
          .role-selection-heading {
            font-size: 24px;
          }
          .role-btn {
            font-size: 14px;
            padding: 12px 0;
          }
        }
        /* Modal responsiveness */
        @media (max-width: 500px) {
          .role-selection-modal {
            min-width: 90vw !important;
            padding: 1rem 0.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
export default RoleSelection;
