import "./ModalLogin.css";

const ModalLogin = ({ closeModal, openRegister }) => {
  return (
    <div className="background" onClick={closeModal}>
      <div className="modal-card login-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-side login-left">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Iniciar Sesión</h2>
        <p className="description">Accede a tus viajes y experiencias personalizadas</p>
        <div className="input-group">
          <i className="fa-solid fa-envelope"></i>
          <input type="email" placeholder="Correo electrónico" />
        </div>
        <div className="input-group">
          <i className="fa-solid fa-lock"></i>
          <input type="password" placeholder="Contraseña" />
        </div>
        <button className="login-button">Iniciar Sesión</button>
      </div>
      <div className="modal-side login-right">
          <div className="overlay-shape">
            <h2>¡Bienvenido a bordo!</h2>
            <p>Regístrate para reservar vuelos, guardar destinos y más</p>
            <button className="swap-button" onClick={() => openRegister("register")}>
              Registrarse
            </button>


          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ModalLogin;
