import { Navigate } from "react-router-dom";
import { useEffect } from "react"; 

const AirlineAdminRoute = ({ children, user, setModalVisible }) => {
  const isAirline = user && user.role === "airline";
  const isAdmin = user && user.role === "admin";
  const isAuthenticated = !!user; // true si hay un usuario logueado

  // Si no hay usuario logueado en absoluto, necesitamos que inicie sesión.
  if (!isAuthenticated) {
    // useEffect para asegurar que setModalVisible se llama una vez y no en cada render.
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]); // Dependencia para que se ejecute si setModalVisible cambia 
    return <Navigate to="/" replace />;
  }

  // Si el usuario está logueado pero no tiene el rol de Airline ni Admin,
  // solo lo redirigimos sin mostrar el modal de login.
  if (!isAirline && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario es Airline o Admin, permite el acceso
  return children;
};

export default AirlineAdminRoute;