const express = require('express');
const path = require('path');
const creditoController = require('./controllers/creditoController'); 
const db = require('./config/db.js'); 

const app = express();

// ==========================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ==========================================
// 3. RUTAS DE LOS FORMULARIOS
// ==========================================

// Ruta POST para el registro de usuarios 
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

// Ruta POST: El proceso de Login 
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

// Ruta POST Procesar la Solicitud de Crédito con datos completos y asignación de analista
app.post('/Solicitud_de_creditoServlet', creditoController.procesarSolicitud);

// ==========================================
// 5. SERVIR ARCHIVOS ESTÁTICOS DESDE LA CARPETA PUBLIC 
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));

// 6. ENCENDER EL MOTOR
const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor Brocash corriendo en http://localhost:${PUERTO}`);
    console.log(`==================================================`);
});