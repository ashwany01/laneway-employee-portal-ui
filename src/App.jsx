import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import EmployeeProfile from "./pages/EmployeeProfile";
import HierarchyPage from "./pages/HierarchyPage";
import BenchDashboard from "./pages/BenchDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/employees" element={<EmployeeDirectory />} />
      <Route path="/profile/:id" element={<EmployeeProfile />} />
      <Route path="/hierarchy" element={<HierarchyPage />} />
      <Route path="/bench" element={<BenchDashboard />} />
    </Routes>
  );
}

export default App;