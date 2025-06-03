// Componente para proteger rutas de Aerolínea/Admin
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AirlineAdminRoute = ({ children, user, setModalVisible }) => {
  // Verficación para saber si es airline o admin
  const isAirline = user && user.role === "airline";
  const isAdmin = user && user.role === "admin";

  // Si no es Airline ni Admin muestra el modal de login y redirige a /
  if (!isAirline && !isAdmin) {
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />;
  }

  // Si es Airline o Admin, retorna
  return children;
};

export default AirlineAdminRoute;
