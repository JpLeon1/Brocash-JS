// models/creditoModel.js
const db = require('../config/db');

const Credito = {
   // models/creditoModel.js

// 1. METODO CREATE - Crear una nueva solicitud de crédito
    crear: (datosCredito, callback) => {
        const query = `INSERT INTO credito 
            (ID_USUARIO, ID_ANALISTA, INGRESOS, MONTO_SOLICITADO, PLAZO_MESES, ESTADO, NOMBRE_COMPLETO, OCUPACION, TELEFONO, FECHA_SOLICITUD) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const valorMonto = datosCredito.montoSolicitado || datosCredito.montosolicitado;
        const valorPlazo = datosCredito.plazoMeses || datosCredito.plazo_meses || 12;

        db.query(query, [
            datosCredito.Cedula, 
            datosCredito.idAnalista,
            datosCredito.ingresos, 
            valorMonto, 
            valorPlazo,
            datosCredito.estado || 'Pendiente', 
            datosCredito.Nombre,
            datosCredito.ocupacion, 
            datosCredito.telefono, 
            datosCredito.fechaSolicitud
        ], callback);
    },

    // 2. METODO READ - Obtener todos los créditos para el Analista 
    obtenerTodos: (callback) => {
        const query = 'SELECT * FROM credito ORDER BY FECHA_SOLICITUD DESC';
        db.query(query, callback);
    },

    // 3. METODO UPDATE - Cambiar estado del crédito 
    actualizarEstado: (idCredito, nuevoEstado, callback) => {
        const query = 'UPDATE credito SET ESTADO = ? WHERE ID_CREDITO = ?';
        db.query(query, [nuevoEstado, idCredito], callback);
    },

    // 4. METODO DELETE - Eliminar una solicitud de crédito   
    eliminar: (idCredito, callback) => {
        const query = 'DELETE FROM credito WHERE ID_CREDITO = ?';
        db.query(query, [idCredito], callback);
    },
    
    // 5. Validar si el usuario ya tiene un crédito activo o reciente
    buscarPorCedula: (cedula, callback) => {
        const query = "SELECT * FROM credito WHERE ID_USUARIO = ? ORDER BY FECHA_SOLICITUD DESC LIMIT 1";
        db.query(query, [cedula], callback);
    },

    verificarPendiente: (cedulaUsuario, callback) => {
        const query = "SELECT * FROM credito WHERE ID_USUARIO = ? AND UPPER(ESTADO) = 'PENDIENTE'";
        db.query(query, [cedulaUsuario], callback);
    },

    // 6. Desembolso al saldo del usuario
    desembolsarDinero: (idUsuario, monto, callback) => {
        const query = "UPDATE cuenta SET SALDO = IFNULL(SALDO, 0) + ? WHERE ID_USUARIO = ?";
        db.query(query, [monto, idUsuario], callback);
    }
};

module.exports = Credito;