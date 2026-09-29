const express = require('express');
const path = require('path');
const db = require('./config/db.js'); // 🔌 Conexión real a MySQL

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
app.post('/recuperar-password', authController.recuperarPassword);

// ==========================================
// 4. RUTAS DE CRÉDITOS (CRUD)
// ==========================================
// Crear solicitud
app.post('/solicitar-credito', creditoController.procesarSolicitud);

// Obtener lista completa para el analista
app.get('/listar-creditos', creditoController.listarCreditos);

// Modificar estado (Soporta PUT del frontend y POST por compatibilidad)
app.put('/modificar-estado', creditoController.modificarEstado);
app.post('/modificar-estado', creditoController.modificarEstado);

// Eliminar crédito (Soporta DELETE con parámetro /:id y POST)
app.delete('/borrar-credito/:id', creditoController.borrarCredito);
app.delete('/borrar-credito', creditoController.borrarCredito);
app.post('/borrar-credito', creditoController.borrarCredito);

// Consultar estado por cédula del cliente
app.get('/estado-credito/:cedula', creditoController.obtenerEstadoUsuario);

// ==========================================
// 5. MIDDLEWARE DE REGISTRO / MANEJO DE RUTAS NO ENCONTRADAS (404)
// ==========================================
app.use((req, res) => {
    console.log(`⚠️ Ruta no encontrada (404): ${req.method} ${req.url}`);
    res.status(404).json({ ok: false, mensaje: `La ruta ${req.method} ${req.url} no existe en el servidor.` });
});

// ==========================================
// 6. ARRANQUE DEL SERVIDOR
// ==========================================
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor Brocash corriendo en http://localhost:${PORT}`);
    console.log(`==================================================`);
});