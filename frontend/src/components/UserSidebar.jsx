import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserSidebar.css";

const UserSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <aside className="user-sidebar">
      <div className="sidebar-header">
        <h2>
          Ping<span>notes</span>
        </h2>
        <p className="user-role">Student Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item active">
            <span className="nav-icon">📚</span>
            <span>My Subjects</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📁</span>
            <Link
              to="/my-files"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              My Files
            </Link>
          </li>
          <li className="nav-item">
            <span className="nav-icon">👥</span>
            <span>My Groups</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
