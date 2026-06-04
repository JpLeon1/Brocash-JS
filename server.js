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
    const { Nombre, Cedula, email, telefono, password, confirmPassword } = req.body;

    if (password && password === confirmPassword) {
        
        // 1. Agregamos PASSWORD a las columnas y un "?" extra al final
        const query = 'INSERT INTO REGISTRO_USUARIO (ID_USUARIO, NOMBRE, APELLIDO, EDAD, EMAIL, TELEFONO, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        // 2. Agregamos la variable password al final de la lista
        db.query(query, [Cedula, Nombre, "N/A", 18, email, telefono, password], (error, results) => {
            if (error) {
                console.error('Error al insertar en la BD:', error);
                return res.redirect('/Registro_de_usuario.html?error=formulario');
            }
            console.log(`¡Usuario ${Nombre} registrado con éxito en MySQL con contraseña!`);
            res.redirect('/Pagina_Principal.html?registro=exito');
        });

    } else {
        res.redirect('/Registro_de_usuario.html?error=claves_no_coinciden');
    }
});

const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor Brocash corriendo en http://localhost:${PUERTO}`);
    console.log(`==================================================`);
});