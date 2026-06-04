const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// 1. Configuración para poder leer los datos que envían tus formularios HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2. Servir tus archivos de diseño (HTML, CSS, Logos) 
app.use(express.static(path.join(__dirname)));

// 3. Conexión a Base de Datos MySQL 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '6406',
    database: 'Brocash'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos MySQL:', err);
        return;
    }
    console.log('¡Conectado con éxito a la base de datos MySQL Brocash!');
});

// 4. Ruta POST: El reemplazo directo de tu RegistroServlet.java
app.post('/RegistroServlet', (req, res) => {
    // Capturamos los datos que vienen desde tu HTML
    const { Nombre, Cedula, email, telefono, password, confirmPassword } = req.body;

    // Como en tu BD no hay columna password por ahora, validamos solo en JS que coincidan
    if (password && password === confirmPassword) {
        
        // CORREGIDO: Nombre de tabla y columnas exactas a tu script de GitHub
        const query = 'INSERT INTO REGISTRO_USUARIO (ID_USUARIO, NOMBRE, APELLIDO, EDAD, EMAIL, TELEFONO) VALUES (?, ?, ?, ?, ?, ?)';
        
        // Enviamos los datos en el orden exacto de la consulta SQL
        // Pasamos "N/A" en apellido y 18 en edad por defecto, tal como lo tenías antes
        db.query(query, [Cedula, Nombre, "N/A", 18, email, telefono], (error, results) => {
            if (error) {
                console.error('Error al insertar en la BD:', error);
                return res.redirect('/Registro_de_usuario.html?error=formulario');
            }
            // Si todo sale bien, te redirige a tu Página Principal
            console.log(`¡Usuario ${Nombre} registrado con éxito en MySQL!`);
            res.redirect('/Pagina_Principal.html?registro=exito');
        });

    } else {
        // Si las contraseñas no coinciden
        res.redirect('/Registro_de_usuario.html?error=claves_no_coinciden');
    }
});

const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor Brocash corriendo en http://localhost:${PUERTO}`);
    console.log(`==================================================`);
});