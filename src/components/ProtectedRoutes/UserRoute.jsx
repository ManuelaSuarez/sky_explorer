import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children, user, setModalVisible }) => {
  const isUser = user && user.role === "user";

  // condicional para ver si es user o no
  if (!isUser) {
    // Si no hay usuario logueado abre el login
    if (!user) {
      useEffect(() => {
        setModalVisible("login");
      }, [setModalVisible]);
    }
    return <Navigate to="/" replace />;
  }

  // Si es user renderiza lo que corresponda
  return children;
};

export default UserRoute;
