import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const AdminRoute = ({ children, user, setModalVisible }) => {
  const isAdmin = user && user.role === "admin";
  const isAuthenticated = !!user; // true si hay un usuario logueado

  // Si no hay usuario logueado pide que inicie sesión.
  if (!isAuthenticated) {
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />;
  }

  // Si el usuario logueado no es admin redirige
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es admin renderiza lo que corresponda
  return children;
};

export default AdminRoute;
