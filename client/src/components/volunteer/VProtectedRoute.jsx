import { Navigate } from "react-router-dom";
import { useVolunteerAuth } from "../../context/VolunteerAuthContext";

function VProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useVolunteerAuth();

  if (loading) {
    return (
      <div className="v-loading-screen">
        <div className="v-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/volunteer/login" replace />;
  }

  return children;
}

export default VProtectedRoute;
