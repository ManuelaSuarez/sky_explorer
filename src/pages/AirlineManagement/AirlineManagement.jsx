import { useState, useEffect } from "react";
import "./AirlineManagement.css";
import { FaUser, FaGlobe, FaIdCard, FaTrash, FaCog } from "react-icons/fa";

const AirlineManagement = () => {
  const [airlines, setAirlines] = useState([]);
  const [newAirline, setNewAirline] = useState({
    name: "",
    code: "",
    cuit: "",
    email: "",
    password: "", // Añadir campo de contraseña para la creación
  });
  const [editingAirlineId, setEditingAirlineId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el token del localStorage
  const getToken = () => {
    return localStorage.getItem("token"); // Asumiendo que guardas el token aquí
  };

  // Obtener aerolíneas
  const fetchAirlines = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No autenticado. Por favor inicie sesión.");
      }

      const response = await fetch("http://localhost:3000/api/airlines", {
        // Ruta directa
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cargar aerolíneas.");
      }

      const data = await response.json();
      setAirlines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const handleAirlineInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirline({ ...newAirline, [name]: value });
  };

  const handleCreateAirline = async () => {
    if (
      !newAirline.name ||
      !newAirline.code ||
      !newAirline.cuit ||
      !newAirline.email ||
      !newAirline.password // Validar la contraseña
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(newAirline.cuit)) {
      alert("El formato del CUIT debe ser XX-XXXXXXXX-X");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAirline.email)) {
      alert("El formato del email no es válido");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No autenticado. Por favor inicie sesión.");
      }

      const response = await fetch("http://localhost:3000/api/airlines", {
        // Ruta directa
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAirline),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear aerolínea.");
      }

      const createdAirline = await response.json();
      setAirlines([createdAirline, ...airlines]); // Agrega la nueva aerolínea al estado local
      setNewAirline({ name: "", code: "", cuit: "", email: "", password: "" }); // Limpiar formulario
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteAirline = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar esta aerolínea?")) {
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No autenticado. Por favor inicie sesión.");
      }

      const response = await fetch(`http://localhost:3000/api/airlines/${id}`, {
        // Ruta directa
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar aerolínea.");
      }

      setAirlines(airlines.filter((airline) => airline.id !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditAirline = (id) => {
    setEditingAirlineId(id);
    const airlineToEdit = airlines.find((airline) => airline.id === id);
    setNewAirline({ ...airlineToEdit, password: "" }); // No cargar la contraseña para edición
  };

  const handleUpdateAirline = async () => {
    if (
      !newAirline.name ||
      !newAirline.code ||
      !newAirline.cuit ||
      !newAirline.email
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(newAirline.cuit)) {
      alert("El formato del CUIT debe ser XX-XXXXXXXX-X");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAirline.email)) {
      alert("El formato del email no es válido");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No autenticado. Por favor inicie sesión.");
      }

      const response = await fetch(
        `http://localhost:3000/api/airlines/${editingAirlineId}`,
        {
          // Ruta directa
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newAirline.name,
            code: newAirline.code,
            cuit: newAirline.cuit,
            email: newAirline.email,
          }), // No se envía la contraseña al actualizar, solo los campos editables
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar aerolínea.");
      }

      const updatedAirline = await response.json();
      setAirlines(
        airlines.map((airline) =>
          airline.id === editingAirlineId ? updatedAirline : airline
        )
      );
      setEditingAirlineId(null);
      setNewAirline({ name: "", code: "", cuit: "", email: "", password: "" }); // Limpiar formulario
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingAirlineId(null);
    setNewAirline({ name: "", code: "", cuit: "", email: "", password: "" });
  };

  if (loading) {
    return (
      <div className="airline-management-container">Cargando aerolíneas...</div>
    );
  }

  if (error) {
    return (
      <div className="airline-management-container error-message">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="airline-management-container">
      <h2>Administración de Aerolíneas</h2>

      {/* La lista de aerolíneas va primero */}
      <div className="airline-list">
        <h3>Lista de Aerolíneas</h3>
        {airlines.length === 0 ? (
          <p>No hay aerolíneas registradas.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Código</th>
                <th>CUIT</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map((airline) => (
                <tr key={airline.id}>
                  <td>{airline.id}</td>
                  <td>{airline.name}</td>
                  <td>{airline.code}</td>
                  <td>{airline.cuit}</td>
                  <td>{airline.email}</td>
                  <td className="action-buttons">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteAirline(airline.id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="settings-button"
                      onClick={() => handleEditAirline(airline.id)}
                    >
                      <FaCog />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Luego el formulario de creación/edición */}
      <div className="airline-form">
        <h3>
          {editingAirlineId ? "Editar Aerolínea" : "Crear Nueva Aerolínea"}
        </h3>
        <div className="form-group">
          <label>Nombre Aerolínea</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              value={newAirline.name}
              onChange={handleAirlineInputChange}
              placeholder="Nombre Aerolínea"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Código IATA</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="code"
              value={newAirline.code}
              onChange={handleAirlineInputChange}
              placeholder="Código IATA Aerolínea"
            />
          </div>
        </div>

        <div className="form-group">
          <label>CUIT</label>
          <div className="input-with-icon">
            <FaGlobe className="input-icon" />
            <input
              type="text"
              name="cuit"
              pattern="\d{2}-\d{8}-\d{1}"
              value={newAirline.cuit}
              onChange={handleAirlineInputChange}
              placeholder="CUIT Aerolínea"
            />
          </div>
        </div>

        <div className="form-group">
          <label>EMAIL</label>
          <div className="input-with-icon">
            <FaIdCard className="input-icon" />
            <input
              type="email"
              name="email"
              value={newAirline.email}
              onChange={handleAirlineInputChange}
              placeholder="Email Aerolínea"
            />
          </div>
        </div>

        {!editingAirlineId && (
          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <FaIdCard className="input-icon" />
              <input
                type="password"
                name="password"
                value={newAirline.password}
                onChange={handleAirlineInputChange}
                placeholder="Contraseña"
              />
            </div>
          </div>
        )}

        {editingAirlineId ? (
          <div className="form-actions">
            <button className="update-button" onClick={handleUpdateAirline}>
              Actualizar
            </button>
            <button className="cancel-button" onClick={handleCancelEdit}>
              Cancelar
            </button>
          </div>
        ) : (
          <button className="create-button" onClick={handleCreateAirline}>
            Crear Aerolínea
          </button>
        )}
      </div>
    </div>
  );
};

export default AirlineManagement;
