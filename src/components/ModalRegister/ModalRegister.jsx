import "./ModalRegister.css";

const ModalRegister = ({ onFlip, onClose }) => {
  return (
    <div className="modal-card register-card">
      <div className="modal-side register-left">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Registrarse</h2>
        <p className="description">Crea tu cuenta y planifica tu próximo destino</p>
        <div className="input-group">
          <i className="fa-solid fa-user"></i>
          <input type="text" placeholder="Nombre completo" />
        </div>
        <div className="input-group">
          <i className="fa-solid fa-envelope"></i>
          <input type="email" placeholder="Correo electrónico" />
        </div>
        <div className="input-group">
          <i className="fa-solid fa-lock"></i>
          <input type="password" placeholder="Contraseña" />
        </div>
        <button className="register-button">Registrarse</button>
      </div>
      <div className="modal-side register-right">
        <div className="overlay-shape">
          <h2>¿Ya tienes un vuelo reservado?</h2>
          <p>Inicia sesión y accede a todos tus itinerarios</p>
          <button className="swap-button" onClick={onFlip}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegister;
