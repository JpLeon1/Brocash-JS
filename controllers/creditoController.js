// controllers/creditoController.js
const Credito = require('../models/creditoModel'); 

// 1. Método CREATE: Procesar la Solicitud de Crédito
exports.procesarSolicitud = (req, res) => {
    // 1. Extraemos la informacion del formulario HTML
    const { Nombre, Cedula, email, ocupacion, telefono, ingresos_mensuales, monto_Solicitado, fechaSolicitud } = req.body;

    console.log(`📡 Controlador: Iniciando validación para cédula ${Cedula}`);

    // =========================================================================
    // Metodo para Verificar si ya existe una solicitud 'Pendiente' y que esta no se "Duplique"
    // =========================================================================
    Credito.verificarPendiente(Number(Cedula), (errorVerificacion, filas) => {
        if (errorVerificacion) {
            console.error('❌ Error al verificar créditos pendientes:', errorVerificacion);
            return res.status(500).send('Error interno del servidor al validar la solicitud');
        }

        // Si la consulta arroja algún resultado, bloqueamos la inserción
        if (filas.length > 0) {
            console.log(`⚠️ Bloqueado: El usuario con cédula ${Cedula} ya tiene un crédito en estudio.`);
            return res.send(`
                <script>
                    alert("⚠️ Lo sentimos, ya cuentas con una solicitud de crédito en estado 'Pendiente'. Debes esperar a que el analista la evalúe.");
                    window.location.href = "javascript:history.back()"; 
                </script>
            `);
        }
        
        // 2. Generamos los valores automáticos del negocio
        const idCredito = Math.floor(100000 + Math.random() * 900000); 
        const idAnalista = 1020856325; // ID por defecto de un analista asignado
        const estado = 'Pendiente'; //  Estado inicial de la solicitud

        console.log(`📡 Controlador: Procesando solicitud N° ${idCredito} para ${Nombre}`);

        // 3. Creamos un objeto con los datos completos para pasarlo al modelo
        const nuevosDatos = {
            idCredito,
            Cedula: Number(Cedula),
            idAnalista,
            ingresos: Number(ingresos_mensuales),
            montoSolicitado: Number(monto_Solicitado),
            estado, 
            Nombre,
            email,
            ocupacion,
            telefono,
            fechaSolicitud
        };

        // 4. Metodo "crear" de modelo Credito para insertar en la base de datos
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
            
            // 5. Respuesta visual de éxito para el usuario en la pantalla 
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

// 2. Metodo READ: Mostrar todos los créditos en la tabla del Analista
exports.listarCreditos = (req, res) => {
    Credito.obtenerTodos((error, rows) => {
        if (error) {
            console.error('❌ Error al leer los créditos:', error);
            return res.status(500).json({ mensaje: 'Error al obtener créditos' });
        }
        res.json(rows); 
    });
};

// 3. Metodo UPDATE: Modificar el estado de un crédito y desembolsar si es aprobado
exports.modificarEstado = (req, res) => {
    const { idCredito, nuevoEstado } = req.body;
    
    // 1. Primero se actualiza el estado del crédito en la base de datos
    Credito.actualizarEstado(idCredito, nuevoEstado, (error, result) => {
        if (error) {
            console.error('❌ Error al actualizar crédito:', error);
            return res.status(500).send('Error interno');
        }
        
        console.log(`✅ Crédito N° ${idCredito} actualizado a: ${nuevoEstado}`);

       // 2. Se realiza el desembolso solo si el nuevo estado es 'Aprobado'
if (nuevoEstado.toLowerCase() === 'aprobado') {
    const queryBuscarCredito = "SELECT ID_USUARIO, MONTO_SOLICITADO FROM CREDITO WHERE ID_CREDITO = ?";
    
    require('../config/db').query(queryBuscarCredito, [idCredito], (errBusqueda, filas) => {
        if (errBusqueda || filas.length === 0) {
            console.error('❌ Error al buscar datos del crédito para desembolso:', errBusqueda);
            return res.redirect('/Vista_Analista.html?update=exito&error=desembolso');
        }

        const registro = filas[0];
        const idUsuario = registro.ID_USUARIO || registro.id_usuario || registro.IdUsuario;
        const montoSolicitado = registro.MONTO_SOLICITADO || registro.monto_solicitado || registro.MontoSolicitado;

        console.log(`📡 Datos recuperados de la BD -> Usuario: ${idUsuario}, Monto: ${montoSolicitado}`);

        if (!idUsuario || !montoSolicitado) {
            console.error('❌ Error: Las columnas de la BD no coinciden con las propiedades del objeto:', registro);
            return res.redirect('/Vista_Analista.html?update=exito&error=columnas');
        }

        // Llamamos al método del modelo para realizar el desembolso
        Credito.desembolsarDinero(idUsuario, montoSolicitado, (errDesembolso, resDesembolso) => {
            if (errDesembolso) {
                console.error(`❌ Error al depositar dinero al usuario ${idUsuario}:`, errDesembolso);
                return res.redirect('/Vista_Analista.html?update=exito&error=saldo');
            }
            console.log(`💵 ¡DESEMBOLSO EXITOSO! Se cargaron $${montoSolicitado} al saldo del usuario ${idUsuario}`);
            return res.redirect('/Vista_Analista.html?update=exito');
        });
    });
} else {
    // 🔀 Si el estado es Rechazado o cualquier otro, redirigimos directamente sin desembolsar
    res.redirect('/Vista_Analista.html?update=exito');
}
        } else {
            res.redirect('/Vista_Analista.html?update=exito'); 
        }
    });
};

// 4. Metodo DELETE: Eliminar físicamente el registro
exports.borrarCredito = (req, res) => {
    const { idCredito } = req.body;

    Credito.eliminar(idCredito, (error, result) => {
        if (error) {
            console.error('❌ Error al eliminar crédito:', error);
            return res.status(500).send('Error interno');
        }
        console.log(`🗑️ Crédito N° ${idCredito} eliminado con éxito de MySQL`);
        res.redirect('/Vista_Analista.html?delete=exito');
    });
};

// 5. Metodo READ: para que el usuario pueda ver el estado del crédito por cédula 
exports.obtenerEstadoUsuario = (req, res) => {
    const { cedula } = req.params;

    Credito.buscarPorCedula(Number(cedula), (error, filas) => {
        if (error) {
            console.error('❌ Error al buscar crédito del usuario:', error);
            return res.status(500).json({ mensaje: 'Error interno' });
        }
        
        if (filas.length === 0) {
            return res.json({ tieneCredito: false });
        }

        res.json({
            tieneCredito: true,
            idCredito: filas[0].ID_CREDITO,
            estado: filas[0].ESTADO,
            montoSolicitado: filas[0].MONTO_SOLICITADO
        });
    });
};