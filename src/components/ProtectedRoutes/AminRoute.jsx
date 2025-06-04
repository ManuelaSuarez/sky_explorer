import { Navigate } from "react-router-dom";
import { useEffect } from "react"; 

const AdminRoute = ({ children, user, setModalVisible }) => {
  const isAdmin = user && user.role === "admin";
  const isAuthenticated = !!user; // true si hay un usuario logueado

  // Si no hay usuario logueado en absoluto, necesitamos que inicie sesión.
  if (!isAuthenticated) {
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />;
  }

  // Si el usuario está logueado pero NO es admin,
  // solo lo redirigimos sin mostrar el modal de login.
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, permite el acceso
  return children;
};

export default AdminRoute;