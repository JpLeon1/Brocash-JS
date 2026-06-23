const express = require('express');
const path = require('path');
const creditoController = require('./controllers/creditoController');
const authController = require('./controllers/authController');
const db = require('./config/db.js'); 

const app = express();

// ==========================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Ruta POST para el registro de usuarios (Formato MVC) 
app.post('/RegistroServlet', authController.registrar);

// Ruta POST: El proceso de Login (Formato MVC)
app.post('/LoginServlet', authController.login);

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