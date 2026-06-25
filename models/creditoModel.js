// models/creditoModel.js
const db = require('../config/db');

const Credito = {
   // models/creditoModel.js

// 1. METODO CREATE - Crear una nueva solicitud de crédito (clientes o usuarios)
crear: (datosCredito, callback) => {
    const query = `INSERT INTO CREDITO 
        (ID_CREDITO, ID_USUARIO, ID_ANALISTA, INGRESOS, MONTO_SOLICITADO, ESTADO, NOMBRE_COMPLETO, EMAIL, OCUPACION, TELEFONO, FECHA_SOLICITUD) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // 🛡️ Buscamos la propiedad asegurándonos de capturar cualquier combinación de mayúsculas/minúsculas
    const valorMonto = datosCredito.montoSolicitado || datosCredito.MontoSolicitado || datosCredito.monto_solicitado;

    db.query(query, [
        datosCredito.idCredito, 
        datosCredito.Cedula, 
        datosCredito.idAnalista,
        datosCredito.ingresos, 
        valorMonto, 
        datosCredito.estado, 
        datosCredito.Nombre,
        datosCredito.email, 
        datosCredito.ocupacion, 
        datosCredito.telefono, 
        datosCredito.fechaSolicitud
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
    buscarPorCedula: (cedula, callback) => {
        const query = "SELECT * FROM CREDITO WHERE ID_USUARIO = ? ORDER BY FECHA_SOLICITUD DESC LIMIT 1";
        db.query(query, [cedula], callback);
    },

verificarPendiente: (cedulaUsuario, callback) => {
    // Realizamos la busqueda en la Base de Datos para verificar  si existe un registro con esa cédula y cual es su  estado.
    const query = "SELECT * FROM CREDITO WHERE ID_USUARIO = ? AND UPPER(ESTADO) = 'PENDIENTE'";
    db.query(query, [cedulaUsuario], callback);
},
// Método para sumar el dinero del crédito aprobado al saldo de la cuenta del usuario
desembolsarDinero: (idUsuario, monto, callback) => {
    // Tomamos el saldo actual y le sumamos el monto del préstamo
    const query = "UPDATE CUENTA SET SALDO = SALDO + ? WHERE ID_USUARIO = ?";
    db.query(query, [monto, idUsuario], callback);
}

};

module.exports = Credito;