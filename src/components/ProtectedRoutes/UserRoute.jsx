import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children, user, setModalVisible }) => {
  const isUser = user && user.role === "user"; 

  if (!isUser) {
    // Si no hay usuario logueado en absoluto, entonces mostramos el modal de login.
    // Si hay user pero el rol no es "user", no mostramos el modal (ya está logueado).
    if (!user) { // Esta condición verifica específicamente si no hay usuario.
      useEffect(() => {
        setModalVisible("login");
      }, [setModalVisible]);
    }
    return <Navigate to="/" replace />;
  }

  // Si es user, permite el acceso
  return children;
};

export default UserRoute;