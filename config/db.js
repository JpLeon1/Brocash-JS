// config/db.js
const mysql = require('mysql2');

// Conexión con tus datos locales de MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '6406',
    database: 'Brocash'
});

// Conexion a la base de datos 
connection.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos MySQL:', err);
        return;
    }
    console.log('¡Conectado con éxito a la base de datos MySQL Brocash desde la configuración MVC! 🛢️');
});

// Exportamos la conexión para que los Modelos la puedan usar más adelante
module.exports = connection;