import { Navigate } from "react-router";

export default function RequireAuth({ children }) {

  const token = localStorage.getItem("access"); // ou récupère le JWT depuis cookie/session

  if (!token) {
    return <Navigate to="/auth/login" replace />; // redirection vers login
  }
  

  return children;
}
