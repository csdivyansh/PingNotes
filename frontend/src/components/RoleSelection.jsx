import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  { label: "Student" },
  { label: "Teacher" },
  { label: "Administrator" }
];

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const buttonDivRef = useRef(null);

  useEffect(() => {
    if (showModal && buttonDivRef.current && window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        buttonDivRef.current,
        { theme: "outline", size: "large" }
      );
      // Optionally show One Tap
      // window.google.accounts.id.prompt();
    }
  }, [showModal]);

  const handleCredentialResponse = (response) => {
    // You can send response.credential (JWT) to your backend for verification and login
    console.log("Encoded JWT ID token:", response.credential);
    // TODO: Send to backend endpoint for Google login
    setShowModal(false);
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
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h2 style={{ marginBottom: 100, fontSize: 50}}>You are a......</h2>
      <div style={{ display: "flex", gap: 32 }}>
        {roles.map(role => (
          <button
            key={role.label}
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "32px 48px",
              fontSize: 18,
              cursor: "pointer"
            }}
            onClick={() => handleRoleClick(role.label)}
          >
            {role.label}
          </button>
        ))}
      </div>
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "2rem 2.5rem",
            borderRadius: 16,
            boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <h3 style={{ marginBottom: 24 }}>Sign in as {selectedRole} with Google</h3>
            <div ref={buttonDivRef} id="buttonDiv" style={{ marginBottom: 16 }}></div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "#eee",
                color: "#333",
                border: "none",
                borderRadius: 8,
                padding: "8px 24px",
                fontSize: 16,
                cursor: "pointer"
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