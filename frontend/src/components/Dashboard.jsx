import React from "react";
import Sidebar from "./Sidebar";
import DashboardCard from "./DashboardCard";
import "./Dashboard.css"; // Copy your style.css here and rename

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1>Admin Dashboard</h1>
        <div className="cards-grid">
          <DashboardCard title="Total Notes" count="120" iconClass="fa-file-alt" color="blue" />
          <DashboardCard title="Students" count="80" iconClass="fa-users" color="green" />
          <DashboardCard title="Teachers" count="15" iconClass="fa-chalkboard-teacher" color="yellow" />
          <DashboardCard title="Groups" count="10" iconClass="fa-folder" color="purple" />
          <DashboardCard title="Subjects" count="12" iconClass="fa-book" color="pink" />
          <DashboardCard title="Admins" count="2" iconClass="fa-user-shield" color="red" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;