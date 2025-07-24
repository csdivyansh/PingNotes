import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./components/AdminLoginPage";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard";
import RoleSelection from "./components/RoleSelection";
import AuthSuccess from "./components/AuthSuccess";
import About from "./components/About";
import Features from "./components/features";
import FAQ from "./components/FAQ";
import Plans from "./components/Plans";
import ExplorePage from "./components/ExplorePage";
import DashboardLayout from "./components/DashboardLayout";
import MyFiles from "./components/MyFiles";
import SettingsPage from "./components/SettingsPage";
import TrashPage from "./components/TrashPage";
import MyGroups from "./components/MyGroups";
import GroupDetail from "./components/GroupDetail";
import FileSummary from "./components/FileSummary";
import FileViewer from "./components/FileViewer";
import { GlobalFileUploadProvider } from "./components/GlobalFileUploadContext";

function App() {
  return (
    <GlobalFileUploadProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="files" element={<MyFiles />} />
            <Route path="groups" element={<MyGroups />} />
            <Route path="groups/:groupId" element={<GroupDetail />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="trash" element={<TrashPage />} />
          </Route>
          <Route path="/files/:id/summary" element={<FileSummary />} />
          <Route path="/files/:id/view" element={<FileViewer />} />
          <Route path="/login" element={<RoleSelection />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Routes>
      </Router>
    </GlobalFileUploadProvider>
  );
}

export default App;
