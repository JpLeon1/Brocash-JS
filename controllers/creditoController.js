// controllers/creditoController.js
const Credito = require('../models/creditoModel');
const nodemailer = require('nodemailer');
const db = require('../config/db');

// CONFIGURACIÓN DEL SMTP (NODEMAILER)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'juanpabloleonpineda@gmail.com', // Correo remitente
        pass: 'gqkymptfdzfwdded'               // Clave de aplicación de Google (sin espacios)
    }
});

// FUNCIÓN HELPER PARA ENVIAR CORREO HTML CON ESTILOS
function enviarCorreoNotificacion(emailDestino, nombreCliente, estado, idCredito) {
    const esAprobado = String(estado).toLowerCase() === 'aprobado';
    const colorEstado = esAprobado ? '#2ecc71' : '#e74c3c';
    const asunto = esAprobado 
        ? `🎉 ¡Tu crédito Brocash N° ${idCredito} ha sido APROBADO!` 
        : `Actualización sobre tu solicitud de crédito Brocash N° ${idCredito}`;

    const plantillaHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 20px;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border-top: 5px solid ${colorEstado}; shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #2ecc71; margin-top: 0; font-size: 24px;">Brocash</h2>
                <p style="color: #333333; font-size: 16px;">Hola <strong>${nombreCliente}</strong>,</p>
                <p style="color: #555555; font-size: 14px;">Te informamos que el estado de tu solicitud de crédito N° <strong>${idCredito}</strong> ha sido actualizado a:</p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <span style="background-color: ${colorEstado}; color: #ffffff; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; letter-spacing: 1px;">
                        ${String(estado).toUpperCase()}
                    </span>
                </div>

                <p style="color: #555555; font-size: 14px;">Puedes ingresar a la plataforma para consultar el detalle de tu cuenta.</p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;">
                <p style="font-size: 12px; color: #888888; text-align: center; margin: 0;">© 2026 Brocash. Este es un mensaje automático, por favor no respondas a este correo.</p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: 'Brocash Notificaciones <no-reply@brocash.com>',
        to: emailDestino,
        subject: asunto,
        html: plantillaHtml
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('❌ Error enviando correo con Nodemailer:', err);
        } else {
            console.log('📧 Notificación enviada con éxito:', info.response);
        }
    });
}

// Helper: determine whether Postman/API client requested JSON.
const esJSON = (req) => req.is('application/json');

// 1. Método CREATE: Procesar la Solicitud de Crédito
exports.procesarSolicitud = (req, res) => {
    const { Nombre, Cedula, email, ocupacion, telefono, ingresos_mensuales, montoSolicitado } = req.body;
    const fechaSolicitud = req.body.fechaSolicitud && req.body.fechaSolicitud.trim() !== ''
        ? req.body.fechaSolicitud
        : new Date().toISOString().slice(0, 10);

    console.log(`📡 Controlador: Iniciando validación para cédula ${Cedula}`);

    Credito.verificarPendiente(Number(Cedula), (errorVerificacion, filas) => {
        if (errorVerificacion) {
            console.error('❌ Error al verificar créditos pendientes:', errorVerificacion);
            if (esJSON(req)) {
                return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor al validar la solicitud' });
            }
            return res.status(500).send('Error interno del servidor al validar la solicitud');
        }

        if (filas.length > 0) {
            console.log(`⚠️ Bloqueado: El usuario con cédula ${Cedula} ya tiene un crédito en estudio.`);
            if (esJSON(req)) {
                return res.status(409).json({
                    ok: false,
                    mensaje: "El usuario ya tiene una solicitud de crédito en estado 'Pendiente'"
                });
            }
            return res.send(`
                <script>
                    alert("⚠️ Lo sentimos, ya cuentas con una solicitud de crédito en estado 'Pendiente'. Debes esperar a que el analista la evalúe.");
                    window.location.href = "javascript:history.back()";
                </script>
            `);
        }

        const idAnalista = 1020856325;
        const estado = 'Pendiente';

        console.log(`📡 Controlador: Procesando solicitud de crédito para ${Nombre}`);

        const nuevosDatos = {
            Cedula: Number(Cedula),
            idAnalista,
            ingresos: Number(ingresos_mensuales),
            montoSolicitado: Number(montoSolicitado),
            estado,
            Nombre,
            email,
            ocupacion,
            telefono,
            fechaSolicitud
        };

        Credito.crear(nuevosDatos, (error, results) => {
            if (error) {
                console.error('❌ Error en el modelo al insertar el crédito:', error);

                if (esJSON(req)) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al procesar la solicitud de crédito',
                        error: error.code || 'DB_ERROR'
                    });
                }

                return res.send(`
                    <div style="text-align: center; font-family: Arial; padding-top: 50px;">
                        <h2 style="color: #e74c3c;">Error al procesar la solicitud</h2>
                        <p>Hubo un problema al guardar los datos ampliados. Verifica tu base de datos.</p>
                        <a href="javascript:history.back()">Regresar al formulario</a>
                    </div>
                `);
            }

            const idCredito = results.insertId;
            console.log(`✅ Controlador: Crédito N° ${idCredito} guardado exitosamente a través del Modelo.`);

            if (esJSON(req)) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Solicitud de crédito registrada correctamente',
                    credito: {
                        idCredito,
                        Cedula: Number(Cedula),
                        estado,
                        montoSolicitado: Number(montoSolicitado),
                        fechaSolicitud
                    }
                });
            }

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
};

// 2. Método READ: Mostrar todos los créditos en la tabla del Analista
exports.listarCreditos = (req, res) => {
    Credito.obtenerTodos((error, rows) => {
        if (error) {
            console.error('❌ Error al leer los créditos:', error);
            return res.status(500).json({ ok: false, mensaje: 'Error al obtener créditos' });
        }
        res.status(200).json(rows);
    });
};

// 3. Método UPDATE: Modificar el estado de un crédito, notificar por correo y desembolsar si es aprobado
exports.modificarEstado = (req, res) => {
    // Sincronización de nomenclatura: Acepta tanto id_credito (frontend) como idCredito
    const idCredito = req.body.id_credito || req.body.idCredito;
    const nuevoEstado = req.body.nuevo_estado || req.body.nuevoEstado;

    if (!idCredito || !nuevoEstado) {
        console.error("❌ Parámetros incompletos recibidos:", req.body);
        return res.status(400).json({ ok: false, mensaje: 'Faltan parámetros id_credito o nuevo_estado en la petición.' });
    }

    // A. Consultar correo y nombre del cliente asociado al crédito antes de actualizar
    const queryBuscarCliente = `
        SELECT RU.EMAIL, RU.NOMBRE 
        FROM CREDITO C 
        JOIN REGISTRO_USUARIO RU ON C.ID_USUARIO = RU.ID_USUARIO 
        WHERE C.ID_CREDITO = ?`;

    db.query(queryBuscarCliente, [idCredito], (errConsulta, resultados) => {
        const clienteInfo = (resultados && resultados.length > 0) ? resultados[0] : null;

        // B. Actualizar el estado en la base de datos
        Credito.actualizarEstado(idCredito, nuevoEstado, (error, result) => {
            if (error) {
                console.error('❌ Error al actualizar crédito:', error);
                if (esJSON(req) || req.xhr || req.headers.accept.includes('json')) {
                    return res.status(500).json({ ok: false, mensaje: 'Error interno al actualizar el crédito', error: error.code || 'DB_ERROR' });
                }
                return res.status(500).send('Error interno');
            }

            console.log(`✅ Crédito N° ${idCredito} actualizado a: ${nuevoEstado}`);

            // C. Disparar correo si se encontraron los datos del cliente
            if (clienteInfo && clienteInfo.EMAIL) {
                enviarCorreoNotificacion(clienteInfo.EMAIL, clienteInfo.NOMBRE, nuevoEstado, idCredito);
            }

            // D. Lógica de desembolso si es Aprobado
            if (String(nuevoEstado).toLowerCase() === 'aprobado') {
                const queryBuscarCredito = "SELECT ID_USUARIO, MONTO_SOLICITADO FROM CREDITO WHERE ID_CREDITO = ?";

                db.query(queryBuscarCredito, [idCredito], (errBusqueda, filas) => {
                    if (errBusqueda || filas.length === 0) {
                        console.error('❌ Error al buscar datos del crédito para desembolso:', errBusqueda);
                        return res.status(200).json({ ok: true, mensaje: `Crédito N° ${idCredito} aprobado y notificado, pero falló el desembolso.` });
                    }

                    const registro = filas[0];
                    const idUsuario = registro.ID_USUARIO || registro.id_usuario || registro.IdUsuario;
                    const montoSolicitado = registro.MONTO_SOLICITADO || registro.monto_solicitado || registro.MontoSolicitado;

                    Credito.desembolsarDinero(idUsuario, montoSolicitado, (errDesembolso) => {
                        if (errDesembolso) {
                            console.error(`❌ Error al asignar dinero al usuario ${idUsuario}:`, errDesembolso);
                        } else {
                            console.log(`💵 ¡DESEMBOLSO EXITOSO! Se cargaron $${montoSolicitado} al saldo del usuario ${idUsuario}`);
                        }

                        return res.status(200).json({
                            ok: true,
                            mensaje: `El estado del crédito N° ${idCredito} cambió a 'Aprobado', se notificó al correo y se realizó el desembolso.`,
                            idCredito,
                            nuevoEstado
                        });
                    });
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    mensaje: `El estado del crédito N° ${idCredito} cambió a '${nuevoEstado}' y se notificó por correo.`,
                    idCredito,
                    nuevoEstado
                });
            }
        });
    });
};

// 4. Método DELETE: Eliminar físicamente el registro
exports.borrarCredito = (req, res) => {
    const idCredito = req.params.id || req.body.idCredito || req.body.id_credito;

    Credito.eliminar(idCredito, (error, result) => {
        if (error) {
            console.error('❌ Error al eliminar crédito:', error);
            return res.status(500).json({ ok: false, mensaje: 'Error interno al eliminar el crédito' });
        }
        console.log(`🗑️ Crédito N° ${idCredito} eliminado con éxito de MySQL`);
        return res.status(200).json({ ok: true, mensaje: 'Crédito eliminado correctamente', idCredito });
    });
};

// 5. Método READ: para que el usuario pueda ver el estado del crédito por cédula
exports.obtenerEstadoUsuario = (req, res) => {
    const { cedula } = req.params;

    Credito.buscarPorCedula(Number(cedula), (error, filas) => {
        if (error) {
            console.error('❌ Error al buscar crédito del usuario:', error);
            return res.status(500).json({ ok: false, mensaje: 'Error interno' });
        }

        if (filas.length === 0) {
            return res.status(200).json({ tieneCredito: false, mensaje: 'No se encontró una solicitud de crédito para la cédula indicada' });
        }

        res.status(200).json({
            tieneCredito: true,
            idCredito: filas[0].ID_CREDITO,
            estado: filas[0].ESTADO,
            montoSolicitado: filas[0].MONTO_SOLICITADO
        });
    });
};