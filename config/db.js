// config/db.js
const mysql = require('mysql2');

// Pool de conexiones: se reconecta solo si MySQL cierra alguna conexión
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Brocash',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión al arrancar
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos MySQL:', err);
        return;
    }
    console.log('¡Conectado con éxito a la base de datos MySQL Brocash desde la configuración MVC! 🛢️');
    connection.release();
});

module.exports = pool;