import React, { useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const DashNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Placeholder: handle file upload logic here
      alert(`Selected file: ${file.name}`);
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
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
          <button
            onClick={handleHomeClick}
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
            }}
          >
            Home
          </button>
          <div style={{ display: "flex", gap: 32 }}>
            <Link
              to="/dashboard"
              style={{
                color:
                  location.pathname === "/dashboard" ? "#0078FF" : "#0a192f",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 18,
                fontFamily: "Poppins, Arial, sans-serif",
                letterSpacing: 0.5,
                transition: "color 0.2s",
              }}
            >
              My Subjects
            </Link>
            <Link
              to="/dashboard/files"
              style={{
                color:
                  location.pathname === "/dashboard/files"
                    ? "#0078FF"
                    : "#0a192f",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 18,
                fontFamily: "Poppins, Arial, sans-serif",
                letterSpacing: 0.5,
                transition: "color 0.2s",
              }}
            >
              My Files
            </Link>
            <Link
              to="/dashboard/groups"
              style={{
                color:
                  location.pathname === "/dashboard/groups"
                    ? "#0078FF"
                    : "#0a192f",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 18,
                fontFamily: "Poppins, Arial, sans-serif",
                letterSpacing: 0.5,
                transition: "color 0.2s",
              }}
            >
              My Groups
            </Link>
            <Link
              to="/dashboard/trash"
              style={{
                color:
                  location.pathname === "/dashboard/trash"
                    ? "#0078FF"
                    : "#0a192f",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 18,
                fontFamily: "Poppins, Arial, sans-serif",
                letterSpacing: 0.5,
                transition: "color 0.2s",
              }}
            >
              Trash
            </Link>
            <Link
              to="/dashboard/settings"
              style={{
                color:
                  location.pathname === "/dashboard/settings"
                    ? "#0078FF"
                    : "#0a192f",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 18,
                fontFamily: "Poppins, Arial, sans-serif",
                letterSpacing: 0.5,
                transition: "color 0.2s",
              }}
            >
              Settings
            </Link>
          </div>
          <>
            <button
              onClick={handleUploadClick}
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
              Upload File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </>
        </div>
      </nav>
      <div style={{ height: 72 }} />
    </>
  );
};

export default DashNav;
