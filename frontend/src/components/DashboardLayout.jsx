import React from "react";
import UserSidebar from "./UserSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <div className="user-dashboard">
    <UserSidebar />
    <main className="dashboard-main">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
