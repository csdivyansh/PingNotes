import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import RoleSelection from './components/RoleSelection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<RoleSelection />} />
      </Routes>
    </Router>
  );
}

export default App; 