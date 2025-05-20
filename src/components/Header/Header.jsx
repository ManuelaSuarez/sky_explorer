import "./Header.css"
import { Link } from "react-router-dom"

const Header = ({ modalVisible, user, onLogout }) => {
  const handleAuthClick = () => {
    if (user) {
      onLogout()
    } else {
      modalVisible("login")
    }
  }

  return (
    <>
      <div className="header_container">
        {/* Logo con redirección al home */}
        <Link to="/" className="header_logo">
          <i className="fa-solid fa-globe"></i>
          <h1 className="header_title">Sky Explorer</h1>
        </Link>

        <ul className="header_list">
          <li>
            <i className="fa-solid fa-compass"></i>
            <a href="">Destinos</a>
          </li>
          <li>
            <i className="fa-solid fa-bookmark"></i>
            <a href="">Favoritos</a>
          </li>
          <li>
            <i className="fa-solid fa-passport"></i>
            <Link to="/myFlights">Mis Vuelos</Link>
          </li>
        </ul>

        <div className="header_user">
          {user && <span className="user-email">Hola, {user.name}</span>}
          <button className="header_signIn" onClick={handleAuthClick}>
            {user ? "Cerrar Sesión" : "Iniciar Sesión"} <i className="fa-solid fa-user"></i>
          </button>
        </div>
      </div>
    </>
  )
}

export default Header
