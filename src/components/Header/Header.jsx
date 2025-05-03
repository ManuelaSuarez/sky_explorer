import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <>
      <div className="header_container">
        <div className="header_logo">
          <i class="fa-solid fa-globe"></i>
          <h1 className="header_title">Sky Explorer</h1>
        </div>
        <ul className="header_list">
          <li>
            <i class="fa-solid fa-plane-up"></i>
            <a href="">Vuelos</a>
          </li>
          <li>
            <i class="fa-solid fa-bookmark"></i>
            <a href="">Favoritos</a>
          </li>
          <li>
            <i class="fa-solid fa-passport"></i>
            <a href="">Mis Viajes</a>
          </li>
        </ul>
        <button className="header_signIn">
          Iniciar Sesión <i class="fa-solid fa-user"></i>
        </button>
      </div>
    </>
  );
};

export default Header;
