// models/creditoModel.js
const db = require('../config/db'); //Conexión a MySQL

const Credito = {

    crear: (datosCredito, callback) => {
        const query = `INSERT INTO CREDITO 
            (ID_CREDITO, ID_USUARIO, ID_ANALISTA, INGRESOS, ESTADO, NOMBRE_COMPLETO, EMAIL, OCUPACION, TELEFONO, FECHA_SOLICITUD) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [
            datosCredito.idCredito,
            datosCredito.Cedula,
            datosCredito.idAnalista,
            datosCredito.ingresos,
            datosCredito.estado,
            datosCredito.Nombre,
            datosCredito.email,
            datosCredito.ocupacion,
            datosCredito.telefono,
            datosCredito.fechaSolicitud     
        ], callback);
    }
};

module.exports = Credito;