// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'brocash'
    // ⚠️ Se eliminó la propiedad 'ssl' que causaba el conflicto local
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos local:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos MySQL local.');
});

module.exports = db;