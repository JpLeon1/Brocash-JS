const express = require('express');
const path = require('path');
const db = require('./config/db.js');

// ==========================================
// 1. IMPORTACIÓN DE CONTROLADORES 
// ==========================================
const authController = require('./controllers/authController');
const creditoController = require('./controllers/creditoController');

const app = express();

// ==========================================
// 2. MIDDLEWARES
// ==========================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// 3. RUTAS DE AUTENTICACIÓN (LOGIN/REGISTRO)
// ==========================================
// Ruta POST para el registro de usuarios
app.post('/RegistroServlet', authController.registrar);

// Ruta POST: El proceso de Login
app.post('/LoginServlet', authController.login);

// ==========================================
// 4. RUTAS DEL CRUD DE CRÉDITOS 
// ==========================================
// C - CREATE: Procesar la Solicitud de Crédito
app.post('/Solicitud_de_creditoServlet', creditoController.procesarSolicitud);

// R - READ: Ruta GET para leer los créditos y enviarlos a la tabla
app.get('/api/creditos', creditoController.listarCreditos);

// U - UPDATE: Ruta POST para actualizar estados (Aprobar/Rechazar)
app.post('/credito/actualizar', creditoController.modificarEstado);

// D - DELETE: Ruta POST para eliminar solicitudes erróneas
app.post('/credito/eliminar', creditoController.borrarCredito);

// ==========================================
// 5. SERVIR ARCHIVOS ESTÁTICOS DESDE LA CARPETA PUBLIC 
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 6. ENCENDER EL MOTOR
// ==========================================
const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor Brocash corriendo en http://localhost:${PUERTO}`);
    console.log(`==================================================`);
});