// models/usuarioModel.js
const db = require('../config/db'); 

const Usuario = {
    // Función para buscar un usuario por su cédula
    buscarPorCedula: (cedula, callback) => {
        const query = 'SELECT * FROM REGISTRO_USUARIO WHERE ID_USUARIO = ?';
        db.query(query, [cedula], callback);
    },

    crear: (datosUsuario, callback) => {
        const query = 'INSERT INTO REGISTRO_USUARIO (ID_USUARIO, NOMBRE, APELLIDO, EDAD, EMAIL, TELEFONO, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [
            datosUsuario.Cedula,
            datosUsuario.Nombre,
            "N/A", 
            18,    
            datosUsuario.email,
            datosUsuario.telefono,
            datosUsuario.password
        ], callback);
    }
};

module.exports = Usuario;
module.exports = Usuario;