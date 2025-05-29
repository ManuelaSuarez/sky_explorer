import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="container_footer">
      <div className="container_our_info">
        <h5>Nuestra Empresa</h5>
        <a href="#">Quiénes Somos</a>
      </div>

      <div className="container_social_media">
        <h5>Nuestras Redes</h5>
        <div className="social_icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-square"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>

      <div className="container_info_extra">
        <h5>Información</h5>
        <ul>
          <li>
            <a href="#">Aerolíneas</a>
          </li>
          <li>
            <a href="#">Privacidad</a>
          </li>
          <li>
            <a href="#">Términos y Condiciones</a>
          </li>
        </ul>
      </div>

      <div className="container_help">
        <h5>Soporte</h5>
        <a href="#">Ayuda</a>
      </div>
    </div>
  );
};

export default Footer;
