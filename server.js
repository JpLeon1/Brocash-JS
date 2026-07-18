const express = require('express');
const path = require('path');
const db = require('./config/db.js'); // 🔌 Conexión real activada a MySQL

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

// Servir archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 3. RUTAS DE AUTENTICACIÓN (LOGIN/REGISTRO)
// ==========================================
app.post('/login', authController.login);
app.post('/registrar', authController.registrar);

// ==========================================
// 4. RUTAS DE CRÉDITOS (CRUD)
// ==========================================
app.post('/solicitar-credito', creditoController.procesarSolicitud);
  app.get('/listar-creditos', creditoController.listarCreditos);
app.post('/modificar-estado', creditoController.modificarEstado);
app.post('/borrar-credito', creditoController.borrarCredito);
app.get('/estado-credito/:cedula', creditoController.obtenerEstadoUsuario);

// ==========================================
// 5. ARRANQUE DEL SERVIDOR
// ==========================================
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor Brocash corriendo en http://localhost:${PORT}`);
    console.log(`==================================================`);
});