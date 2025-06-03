// Componente para proteger rutas de Admin
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children, user, setModalVisible }) => {
  const isAdmin = user && user.role === "admin";

  // Si no es admin abre el modal de login y redirige a /
  if (!isAdmin) {
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />;
  }

  // si es admin, retorna
  return children;
};

export default AdminRoute;
