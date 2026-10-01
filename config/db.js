// config/db.js
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

// Prueba de conexión al arrancar
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos de Aiven:', err.message);
        return;
    }
    console.log('¡Conectado con éxito a la base de datos MySQL Brocash en Aiven Cloud! 🛢️');
    connection.release();
});

module.exports = pool;