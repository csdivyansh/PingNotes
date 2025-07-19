import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <div className="user-dashboard">
    <main className="dashboard-main">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
