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
// 4. RUTA POST Procesar la Solicitud de Crédito
// ==========================================
app.post('/Solicitud_de_creditoServlet', (req, res) => {
    // 1. Extraemos TODOS los campos que viajan desde el HTML
    const { Nombre, Cedula, email, ocupacion, telefono, ingresos, fechaSolicitud } = req.body;

    // 2. Generamos los valores obligatorios automatizados del negocio
    const idCredito = Math.floor(100000 + Math.random() * 900000); // ID Aleatorio
    const idAnalista = 1020856325; // ID de analista por defecto en tu BD
    const estado = 'Pendiente';

    console.log(`📡 Guardando solicitud completa N° ${idCredito} para ${Nombre}`);

    // 3. Sentencia SQL AMPLIADA con las 10 columnas en total
    const query = `INSERT INTO CREDITO 
        (ID_CREDITO, ID_USUARIO, ID_ANALISTA, INGRESOS, ESTADO, NOMBRE_COMPLETO, EMAIL, OCUPACION, TELEFONO, FECHA_SOLICITUD) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // 4. Pasamos los 10 valores en el orden exacto de las columnas
    db.query(query, [idCredito, Cedula, idAnalista, ingresos, estado, Nombre, email, ocupacion, telefono, fechaSolicitud], (error, results) => {
        if (error) {
            console.error('Error al insertar el crédito completo en la BD:', error);
            return res.send(`
                <div style="text-align: center; font-family: Arial; padding-top: 50px;">
                    <h2 style="color: #e74c3c;">Error al procesar la solicitud</h2>
                    <p>Hubo un problema al guardar los datos ampliados. Verifica la estructura de la BD.</p>
                    <a href="javascript:history.back()">Regresar al formulario</a>
                </div>
            `);
        }

        console.log(`¡Crédito N° ${idCredito} con datos completos almacenado con éxito!`);
        
        // Mensaje de confirmación
        res.send(`
            <div style="text-align: center; font-family: Arial; padding-top: 50px;">
                <h1 style="color: #2ecc71;">¡Solicitud Radicada de Forma Exitosa! 🎉</h1>
                <p>Estimado/a <strong>${Nombre}</strong>, tu solicitud ha sido enviada al analista asignado.</p>
                <p>Número de radicado: <strong>${idCredito}</strong></p>
                <p>Estado actual: <span style="background: #f1c40f; padding: 2px 6px; border-radius: 3px;"><strong>${estado}</strong></span></p>
                <br>
                <a href="/Pagina_Principal.html" style="text-decoration: none; background: #3498db; color: white; padding: 10px 20px; border-radius: 5px;">Finalizar y Salir</a>
            </div>
        `);
    });
});

// ==========================================
// 5. SERVIR ARCHIVOS ESTÁTICOS (HTML, CSS, JS, etc.)
// ==========================================
app.use(express.static(path.join(__dirname)));

// 6. ENCENDER EL MOTOR
const PUERTO = 8080;
app.listen(PUERTO, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor Brocash corriendo en http://localhost:${PUERTO}`);
    console.log(`==================================================`);
});
