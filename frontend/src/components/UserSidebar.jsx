import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./UserSidebar.css";

const getCurrentUserName = () => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("adminToken");
  if (!token) return null;
  try {
    const user = JSON.parse(atob(token.split(".")[1]));
    return user.name || null;
  } catch {
    return null;
  }
};

const UserSidebar = () => {
  const navigate = useNavigate();
  const currentName = getCurrentUserName();

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
        <p className="user-role">
          {currentName ? `Welcome, ${currentName}` : "Student Dashboard"}
        </p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
              style={{ color: "inherit", textDecoration: "none" }}
              end
            >
              <span className="nav-icon">📚</span>
              My Subjects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/files"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <span className="nav-icon">📁</span>
              My Files
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/groups"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <span className="nav-icon">👥</span>
              My Groups
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/trash"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <span className="nav-icon">🗑️</span>
              Trash
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <span className="nav-icon">⚙️</span>
              Settings
            </NavLink>
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
