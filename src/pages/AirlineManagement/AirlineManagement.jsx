"use client";

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
  });
  const [editingAirlineId, setEditingAirlineId] = useState(null);

  useEffect(() => {
    // Cargar las aerolíneas desde el localStorage al cargar el componente
    const storedAirlines = localStorage.getItem("airlines");
    if (storedAirlines) {
      setAirlines(JSON.parse(storedAirlines));
    }
  }, []);

  useEffect(() => {
    // Guardar las aerolíneas en el localStorage cada vez que cambian
    localStorage.setItem("airlines", JSON.stringify(airlines));
  }, [airlines]);

  const handleAirlineInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirline({ ...newAirline, [name]: value });
  };

  const handleCreateAirline = () => {
    if (
      newAirline.name &&
      newAirline.code &&
      newAirline.cuit &&
      newAirline.email
    ) {
      // Validar formato de CUIT
      const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
      if (!cuitRegex.test(newAirline.cuit)) {
        alert("El formato del CUIT debe ser XX-XXXXXXXX-X");
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newAirline.email)) {
        alert("El formato del email no es válido");
        return;
      }

      const createdAirline = {
        id: Date.now(),
        name: newAirline.name,
        code: newAirline.code,
        cuit: newAirline.cuit,
        email: newAirline.email,
      };

      // Actualizar la lista de aerolíneas
      setAirlines([createdAirline, ...airlines]);

      // Limpiar el formulario
      setNewAirline({ name: "", code: "", cuit: "", email: "" });
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const handleDeleteAirline = (id) => {
    const updatedAirlines = airlines.filter((airline) => airline.id !== id);
    setAirlines(updatedAirlines);
  };

  const handleEditAirline = (id) => {
    setEditingAirlineId(id);
    const airlineToEdit = airlines.find((airline) => airline.id === id);
    setNewAirline({ ...airlineToEdit });
  };

  const handleUpdateAirline = () => {
    if (
      newAirline.name &&
      newAirline.code &&
      newAirline.cuit &&
      newAirline.email
    ) {
      // Validar formato de CUIT
      const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
      if (!cuitRegex.test(newAirline.cuit)) {
        alert("El formato del CUIT debe ser XX-XXXXXXXX-X");
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newAirline.email)) {
        alert("El formato del email no es válido");
        return;
      }

      const updatedAirlines = airlines.map((airline) =>
        airline.id === editingAirlineId
          ? { ...newAirline, id: editingAirlineId }
          : airline
      );
      setAirlines(updatedAirlines);
      setEditingAirlineId(null);
      setNewAirline({ name: "", code: "", cuit: "", email: "" });
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const handleCancelEdit = () => {
    setEditingAirlineId(null);
    setNewAirline({ name: "", code: "", cuit: "", email: "" });
  };

  return (
    <div className="airline-management-container">
      <h2>Administración de Aerolíneas</h2>

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
    </div>
  );
};

export default AirlineManagement;
