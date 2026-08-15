// controllers/creditoController.js
const Credito = require('../models/creditoModel');

// Helper: determine whether Postman/API client requested JSON.
const esJSON = (req) => req.is('application/json');

// 1. Método CREATE: Procesar la Solicitud de Crédito
exports.procesarSolicitud = (req, res) => {
    const { Nombre, Cedula, email, ocupacion, telefono, ingresos_mensuales, monto_solicitado } = req.body;
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

        // Generamos un ID único para la solicitud de crédito
        const idAnalista = 1020856325;
        const estado = 'Pendiente';

        console.log(`📡 Controlador: Procesando solicitud de crédito para ${Nombre}`);

        const nuevosDatos = {
            
            Cedula: Number(Cedula),
            idAnalista,
            ingresos: Number(ingresos_mensuales),
            montosolicitado: Number(monto_solicitado),
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

    // ID generado automáticamente por MySQL
    const idCredito = results.insertId;


    console.log(`✅ Controlador: Crédito N° ${idCredito} guardado exitosamente a través del Modelo.`);
    
            console.log(`✅ Controlador: Crédito N° ${idCredito} guardado exitosamente a través del Modelo.`);

            if (esJSON(req)) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Solicitud de crédito registrada correctamente',
                    credito: {
                        idCredito,
                        Cedula: Number(Cedula),
                        estado,
                        montosolicitado: Number(monto_solicitado),
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

// 3. Método UPDATE: Modificar el estado de un crédito y desembolsar si es aprobado
exports.modificarEstado = (req, res) => {
    const { idCredito, nuevoEstado } = req.body;

    Credito.actualizarEstado(idCredito, nuevoEstado, (error, result) => {
        if (error) {
            console.error('❌ Error al actualizar crédito:', error);
            if (esJSON(req)) {
                return res.status(500).json({ ok: false, mensaje: 'Error interno al actualizar el crédito', error: error.code || 'DB_ERROR' });
            }
            return res.status(500).send('Error interno');
        }

        console.log(`✅ Crédito N° ${idCredito} actualizado a: ${nuevoEstado}`);

        if (String(nuevoEstado).toLowerCase() === 'aprobado') {
            const queryBuscarCredito = "SELECT ID_USUARIO, MONTO_SOLICITADO FROM CREDITO WHERE ID_CREDITO = ?";

            require('../config/db').query(queryBuscarCredito, [idCredito], (errBusqueda, filas) => {
                if (errBusqueda || filas.length === 0) {
                    console.error('❌ Error al buscar datos del crédito para desembolso:', errBusqueda);
                    if (esJSON(req)) {
                        return res.status(500).json({ ok: false, mensaje: 'El estado fue actualizado, pero no fue posible realizar el desembolso' });
                    }
                    return res.redirect('/Vista_Analista.html?update=exito&error=desembolso');
                }

                const registro = filas[0];
                const idUsuario = registro.ID_USUARIO || registro.id_usuario || registro.IdUsuario;
                const montoSolicitado = registro.MONTO_SOLICITADO || registro.monto_solicitado || registro.MontoSolicitado;

                if (!idUsuario || !montoSolicitado) {
                    console.error('❌ Error: las columnas de la BD no coinciden con las propiedades del objeto:', registro);
                    if (esJSON(req)) {
                        return res.status(500).json({ ok: false, mensaje: 'El estado fue actualizado, pero no se pudieron obtener los datos para el desembolso' });
                    }
                    return res.redirect('/Vista_Analista.html?update=exito&error=columnas');
                }

                Credito.desembolsarDinero(idUsuario, montoSolicitado, (errDesembolso, resDesembolso) => {
                    if (errDesembolso) {
                        console.error(`❌ Error al asignar dinero al usuario ${idUsuario}:`, errDesembolso);
                        if (esJSON(req)) {
                            return res.status(500).json({ ok: false, mensaje: 'El estado fue actualizado, pero ocurrió un error durante el desembolso' });
                        }
                        return res.redirect('/Vista_Analista.html?update=exito&error=saldo');
                    }

                    console.log(`💵 ¡DESEMBOLSO EXITOSO! Se cargaron $${montoSolicitado} al saldo del usuario ${idUsuario}`);
                    if (esJSON(req)) {
                        return res.status(200).json({
                            ok: true,
                            mensaje: 'Crédito actualizado y desembolsado correctamente',
                            idCredito,
                            nuevoEstado,
                            desembolso: { idUsuario, monto: montoSolicitado }
                        });
                    }
                    return res.redirect('/Vista_Analista.html?update=exito');
                });
            });
        } else {
            if (esJSON(req)) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Estado del crédito actualizado correctamente',
                    idCredito,
                    nuevoEstado
                });
            }
            res.redirect('/Vista_Analista.html?update=exito');
        }
    });
};

// 4. Método DELETE: Eliminar físicamente el registro
exports.borrarCredito = (req, res) => {
    const { idCredito } = req.body;

    Credito.eliminar(idCredito, (error, result) => {
        if (error) {
            console.error('❌ Error al eliminar crédito:', error);
            if (esJSON(req)) {
                return res.status(500).json({ ok: false, mensaje: 'Error interno al eliminar el crédito', error: error.code || 'DB_ERROR' });
            }
            return res.status(500).send('Error interno');
        }
        console.log(`🗑️ Crédito N° ${idCredito} eliminado con éxito de MySQL`);
        if (esJSON(req)) {
            if (result.affectedRows === 0) {
                return res.status(404).json({ ok: false, mensaje: 'No se encontró el crédito para eliminar', idCredito });
            }
            return res.status(200).json({ ok: true, mensaje: 'Crédito eliminado correctamente', idCredito });
        }
        res.redirect('/Vista_Analista.html?delete=exito');
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
