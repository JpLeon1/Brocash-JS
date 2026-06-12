const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// 1. Configuración para poder leer los datos que envían tus formularios HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2. Conexión a Base de Datos MySQL 
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

// ==========================================
// 3. RUTAS DE LOS FORMULARIOS (Prioridad de procesamiento)
// ==========================================

// Ruta POST para el registro de usuarios // 
app.post('/RegistroServlet', (req, res) => {
    const { Nombre, Cedula, email, telefono, password, confirmPassword } = req.body;

    if (password && password === confirmPassword) {
        
        const query = 'INSERT INTO REGISTRO_USUARIO (ID_USUARIO, NOMBRE, APELLIDO, EDAD, EMAIL, TELEFONO, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
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

// Ruta POST: El proceso de Login //
app.post('/LoginServlet', (req, res) => {
    const { Cedula, password } = req.body;
    console.log(`📡 Intentando iniciar sesión para la cédula: ${Cedula}`);

    const query = 'SELECT * FROM REGISTRO_USUARIO WHERE ID_USUARIO = ?';

    db.query(query, [Cedula], (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos en el Login:', error);
            return res.redirect('/Pagina_Principal.html?error=servidor');
        }

        if (results.length > 0) {
            const usuarioEncontrado = results[0];
            
            if (usuarioEncontrado.PASSWORD === password) {
                console.log(`¡Inicio de sesión exitoso! Bienvenido, ${usuarioEncontrado.NOMBRE}`);
                // Recuerda tener tu archivo Solicitud_Credito.html creado en tu carpeta
                res.redirect('/Solicitud_de_credito.html'); 
                
            } else {
                console.log('Intento de login fallido: Contraseña incorrecta.');
                res.redirect('/Pagina_Principal.html?error=datos_incorrectos');
            }
        } else {
            console.log('Intento de login fallido: El usuario no existe.');
            res.redirect('/Pagina_Principal.html?error=usuario_no_existe');
        }
    });
});

// ==========================================
// 4. SERVIR ARCHIVOS ESTÁTICOS (HTML, CSS, JS, etc.)
// ==========================================
app.use(express.static(path.join(__dirname)));

// 5. ENCENDER EL MOTOR
const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor Brocash corriendo en http://localhost:${PUERTO}`);
    console.log(`==================================================`);
});