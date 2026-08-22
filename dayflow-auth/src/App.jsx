import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPlaceholder from "./pages/DashboardPlaceholder.jsx";

// Routing for the auth flow. In the full Dayflow app, "/dashboard"
// is replaced by the real AdminDashboard / EmployeeDashboard pages,
// chosen based on the logged-in user's role.
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
