import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  { label: "Student" },
  { label: "Teacher" },
  { label: "Administrator" }
];

export default function RoleSelection() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff", // or your theme color
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
            onClick={() => {
              if (role.label === "Administrator") {
                navigate("/admin/login");
              } else {
                // You can add navigation for other roles here
              }
            }}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
} 