// models/creditoModel.js
const db = require('../config/db');

const Credito = {
    // 1. METODO CREATE - Crear una nueva solicitud de crédito (clientes o usuarios)
    crear: (datosCredito, callback) => {
        const query = `INSERT INTO CREDITO 
            (ID_CREDITO, ID_USUARIO, ID_ANALISTA, INGRESOS, ESTADO, NOMBRE_COMPLETO, EMAIL, OCUPACION, TELEFONO, FECHA_SOLICITUD) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(query, [
            datosCredito.idCredito, datosCredito.Cedula, datosCredito.idAnalista,
            datosCredito.ingresos, datosCredito.estado, datosCredito.Nombre,
            datosCredito.email, datosCredito.ocupacion, datosCredito.telefono, datosCredito.fechaSolicitud
        ], callback);
    },

    // 2. METODO READ - Obtener todos los créditos para el Analista 
    obtenerTodos: (callback) => {
        const query = 'SELECT * FROM CREDITO ORDER BY FECHA_SOLICITUD DESC';
        db.query(query, callback);
    },

    // 3. METODO UPDATE - Cambiar estado del crédito 
    actualizarEstado: (idCredito, nuevoEstado, callback) => {
        const query = 'UPDATE CREDITO SET ESTADO = ? WHERE ID_CREDITO = ?';
        db.query(query, [nuevoEstado, idCredito], callback);
    },

    // 4. METODO DELETE - Eliminar una solicitud de crédito   
    eliminar: (idCredito, callback) => {
        const query = 'DELETE FROM CREDITO WHERE ID_CREDITO = ?';
        db.query(query, [idCredito], callback);
    },
    
    // 5. Validar si el usuario ya tiene un crédito en estudio 
verificarPendiente: (cedulaUsuario, callback) => {
    // Realizamos la busqueda en la Base de Datos para verificar  si existe un registro con esa cédula y cual es su  estado.
    const query = "SELECT * FROM CREDITO WHERE ID_USUARIO = ? AND UPPER(ESTADO) = 'PENDIENTE'";
    db.query(query, [cedulaUsuario], callback);
}

};

module.exports = Credito;