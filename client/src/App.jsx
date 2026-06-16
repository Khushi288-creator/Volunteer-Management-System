import { Routes, Route } from "react-router-dom";

// ── Public / Admin (existing) ──────────────────────────────────────────────
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// ── Volunteer (Phase 1) ────────────────────────────────────────────────────
import VSignup from "./pages/volunteer/VSignup";
import VLogin from "./pages/volunteer/VLogin";
import VDashboard from "./pages/volunteer/VDashboard";
import VProfile from "./pages/volunteer/VProfile";
import VProtectedRoute from "./components/volunteer/VProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Admin routes (unchanged) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Volunteer auth (public) */}
      <Route path="/volunteer/signup" element={<VSignup />} />
      <Route path="/volunteer/login" element={<VLogin />} />

      {/* Volunteer protected routes */}
      <Route
        path="/volunteer/dashboard"
        element={
          <VProtectedRoute>
            <VDashboard />
          </VProtectedRoute>
        }
      />
      <Route
        path="/volunteer/profile"
        element={
          <VProtectedRoute>
            <VProfile />
          </VProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
