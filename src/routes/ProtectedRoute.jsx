import { Navigate } from "react-router";
import { getCookie } from "../utils/csrf";  

const ProtectedRoute = ({ children }) => {
  const token = getCookie("access"); // Si tu utilises un autre nom, change ici

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
