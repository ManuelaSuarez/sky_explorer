// Componente para proteger rutas de Usuarios
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children, user, setModalVisible }) => {
  const isUser = user && user.role === "user"; /*|| user.role === "admin"*/

  // Si no es user abre el modal de login y redirige a /
  useEffect(() => {
    if (!isUser) {
      setModalVisible("login");
    }
  }, [isUser, setModalVisible]);

  if (!isUser) {
    return <Navigate to="/" replace />;
  }

  // Si es user, retorna
  return children;
};

export default UserRoute;
