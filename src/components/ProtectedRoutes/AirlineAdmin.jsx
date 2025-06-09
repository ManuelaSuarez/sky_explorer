import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const AirlineAdminRoute = ({ children, user, setModalVisible }) => {
  const isAirline = user && user.role === "airline";
  const isAdmin = user && user.role === "admin";
  const isAuthenticated = !!user; // true si hay un usuario logueado

  // Si no hay usuario logueado pide que inice sesión
  if (!isAuthenticated) {
    // useEffect para que el modal se llame una vez
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />;
  }

  // Si el usuario está logueado pero no tiene es Airline ni Admin se redirige a la home
  if (!isAirline && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario es Airline o Admin renderiza lo que corresponda
  return children;
};

export default AirlineAdminRoute;
