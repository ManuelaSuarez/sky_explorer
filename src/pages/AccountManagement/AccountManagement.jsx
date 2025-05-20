"use client"

import { useState } from "react"
import { FaTrash, FaCog, FaUser, FaEnvelope, FaIdCard, FaPhone, FaGlobe, FaLock, FaCalendarAlt } from "react-icons/fa"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./AccountManagement.css"

const AccountManagement = () => {
  // Estado para los usuarios existentes
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Usuario Admin",
      email: "usuarioadmin@gmail.com",
      role: "Administrador",
    },
    {
      id: 2,
      name: "Example Cliente",
      email: "examplecliente@gmail.com",
      role: "Cliente",
    },
  ])

  // Estado para el formulario de creación de usuario
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    birthday: new Date(),
    nationality: "Argentina",
    dni: "",
    phone: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  })

  // Manejar cambios en el formulario de usuario
  const handleUserInputChange = (e) => {
    const { name, value } = e.target
    setNewUser({
      ...newUser,
      [name]: value,
    })
  }

  // Manejar cambio de fecha para usuario
  const handleUserDateChange = (date) => {
    setNewUser({
      ...newUser,
      birthday: date,
    })
  }

  // Crear nuevo usuario
  const handleCreateUser = () => {
    // Validar campos requeridos
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    // Validar que las contraseñas coincidan
    if (newUser.password !== newUser.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    // Validar que los emails coincidan
    if (newUser.email !== newUser.confirmEmail) {
      alert("Los correos electrónicos no coinciden")
      return
    }

    // Crear nuevo usuario con ID único
    const newUserWithId = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: "Cliente",
    }

    // Añadir a la lista de usuarios
    setUsers([...users, newUserWithId])

    // Resetear formulario
    setNewUser({
      username: "",
      name: "",
      birthday: new Date(),
      nationality: "Argentina",
      dni: "",
      phone: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    })

    alert("Usuario creado con éxito")
  }

  // Editar usuario
  const handleEditUser = (id) => {
    alert(`Editando usuario con ID: ${id}`)
    // Aquí iría la lógica para editar un usuario
  }

  // Eliminar usuario
  const handleDeleteUser = (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  return (
    <div className="account-management-container">
      <div className="management-content">
        <h1 className="management-title">Panel de Administración</h1>

        {/* Tabla de usuarios existentes */}
        <div className="users-table-container">
          <div className="table-with-scrollbar">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="action-buttons">
                      <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                        <FaTrash />
                      </button>
                      <button className="settings-button" onClick={() => handleEditUser(user.id)}>
                        <FaCog />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario para crear nuevo usuario */}
        <div className="create-user-section">
          <h2 className="create-user-title">Crear Nuevo Usuario</h2>

          <div className="create-user-form-container">
            <div className="create-user-form">
              {/* Primera fila */}
              <div className="user-form-row">
                <div className="form-group">
                  <label>Usuario</label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="username"
                      value={newUser.username}
                      onChange={handleUserInputChange}
                      placeholder="Usuario"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nombre</label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      value={newUser.name}
                      onChange={handleUserInputChange}
                      placeholder="Example"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Fecha de nacimiento</label>
                  <div className="input-with-icon date-picker-container">
                    <FaCalendarAlt className="input-icon" />
                    <DatePicker
                      selected={newUser.birthday}
                      onChange={handleUserDateChange}
                      dateFormat="dd/MM/yyyy"
                      className="date-picker"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nacionalidad</label>
                  <div className="input-with-icon">
                    <FaGlobe className="input-icon" />
                    <input
                      type="text"
                      name="nationality"
                      value={newUser.nationality}
                      onChange={handleUserInputChange}
                      placeholder="Argentina"
                    />
                  </div>
                </div>
              </div>

              {/* Segunda fila */}
              <div className="user-form-row">
                <div className="form-group">
                  <label>DNI</label>
                  <div className="input-with-icon">
                    <FaIdCard className="input-icon" />
                    <input
                      type="text"
                      name="dni"
                      value={newUser.dni}
                      onChange={handleUserInputChange}
                      placeholder="34159789"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <div className="input-with-icon">
                    <FaPhone className="input-icon" />
                    <input
                      type="text"
                      name="phone"
                      value={newUser.phone}
                      onChange={handleUserInputChange}
                      placeholder="40860191"
                    />
                  </div>
                </div>
              </div>

              {/* Tercera fila */}
              <div className="user-form-row">
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleUserInputChange}
                      placeholder="usuarioadmin@gmail.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirmar Email</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="confirmEmail"
                      value={newUser.confirmEmail}
                      onChange={handleUserInputChange}
                      placeholder="usuarioadmin@gmail.com"
                    />
                  </div>
                </div>
              </div>

              {/* Cuarta fila */}
              <div className="user-form-row">
                <div className="form-group">
                  <label>Contraseña</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleUserInputChange}
                      placeholder="********"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={newUser.confirmPassword}
                      onChange={handleUserInputChange}
                      placeholder="********"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de crear */}
              <div className="create-button-container">
                <button type="button" className="create-button" onClick={handleCreateUser}>
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountManagement
