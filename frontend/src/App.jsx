import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./components/AdminLoginPage";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard";
import RoleSelection from "./components/RoleSelection";
import AuthSuccess from "./components/AuthSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/login" element={<RoleSelection />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
