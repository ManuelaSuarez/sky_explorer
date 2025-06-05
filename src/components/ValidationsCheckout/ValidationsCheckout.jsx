const ValidationsCheckout = (datos) => {
  const errores = [];

  datos.forEach((pasajero) => {
    const error = {};

    // Solo se permiten letras, tildes y espacios
    if (!pasajero.nombre || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(pasajero.nombre)) {
      error.nombre = "Nombre inválido o vacío";
    }

    if (
      !pasajero.apellido ||
      !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(pasajero.apellido)
    ) {
      error.apellido = "Apellido inválido o vacío";
    }

    if (
      !pasajero.nacionalidad ||
      !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(pasajero.nacionalidad)
    ) {
      error.nacionalidad = "Nacionalidad inválida o vacía";
    }

    // Solo números, entre 7 y 8 dígitos
    if (!pasajero.dni || !/^[0-9]{7,8}$/.test(pasajero.dni)) {
      error.dni = "DNI inválido";
    }

    // La fecha debe ser válida y no puede ser posterior a hoy
    if (
      !pasajero.fechaNacimiento ||
      new Date(pasajero.fechaNacimiento) > new Date()
    ) {
      error.fechaNacimiento = "Fecha de nacimiento inválida";
    }

    // Validación básica de email
    if (!pasajero.email || !/\S+@\S+\.\S+/.test(pasajero.email)) {
      error.email = "Email inválido o vacío";
    }

    errores.push(error);
  });

  return errores;
};

export default ValidationsCheckout;
