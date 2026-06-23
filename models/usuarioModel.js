// models/usuarioModel.js
const db = require('../config/db'); // Conexión centralizada

const Usuario = {
    // Función para buscar por cédula (Usada en el Login)
    buscarPorCedula: (cedula, callback) => {
        const query = 'SELECT * FROM REGISTRO_USUARIO WHERE ID_USUARIO = ?';
        db.query(query, [cedula], callback);
    },

    // Función para insertar un nuevo usuario (Usada en el Registro)
    crear: (datosUsuario, callback) => {
        const query = 'INSERT INTO REGISTRO_USUARIO (ID_USUARIO, NOMBRE, APELLIDO, EDAD, EMAIL, TELEFONO, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [
            datosUsuario.Cedula,
            datosUsuario.Nombre,
            "N/A", // Apellido por defecto
            18,    // Edad por defecto
            datosUsuario.email,
            datosUsuario.telefono,
            datosUsuario.password
        ], callback);
    }
};

module.exports = Usuario;