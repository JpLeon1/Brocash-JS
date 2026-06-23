// controllers/creditoController.js
const Credito = require('../models/creditoModel'); // se importa el modelo 

exports.procesarSolicitud = (req, res) => {
    // 1. Lo basamos en el formulario HTML
    const { Nombre, Cedula, email, ocupacion, telefono, ingresos, fechaSolicitud } = req.body;

    // 2. Se le da un valor aleatorio a los campos que no vienen del formulario, como el ID del crédito y el analista asignado
    const idCredito = Math.floor(100000 + Math.random() * 900000); 
    const idAnalista = 1020856325; // ID por defecto del analista asignado 
    console.log(`📡 Controlador: Procesando solicitud N° ${idCredito} para ${Nombre}`);

    // 3. Juntamos todos los datos para enviárselos al Modelo
    const nuevosDatos = {
        idCredito,
        Cedula,
        idAnalista,
        ingresos,
        estado,
        Nombre,
        email,
        ocupacion,
        telefono,
        fechaSolicitud
    };

    // 4. Llamamos al método "crear" de nuestro modelo
    Credito.crear(nuevosDatos, (error, results) => {
        if (error) {
            console.error('❌ Error en el modelo al insertar el crédito:', error);
            return res.send(`
                <div style="text-align: center; font-family: Arial; padding-top: 50px;">
                    <h2 style="color: #e74c3c;">Error al procesar la solicitud</h2>
                    <p>Hubo un problema al guardar los datos ampliados. Verifica tu base de datos.</p>
                    <a href="javascript:history.back()">Regresar al formulario</a>
                </div>
            `);
        }

        console.log(`✅ Controlador: Crédito N° ${idCredito} guardado exitosamente a través del Modelo.`);
        
        // 5. Respuesta visual de la pagina para el usuario
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
};