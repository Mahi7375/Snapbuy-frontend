import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
