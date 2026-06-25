exports.procesarSolicitud = (req, res) => {
    // 1. Extraemos la informacion del formulario HTML (AÑADIDO monto_solicitado)
    const { Nombre, Cedula, email, ocupacion, telefono, ingresos, monto_solicitado, fechaSolicitud } = req.body;

    console.log(`📡 Controlador: Iniciando validación para cédula ${Cedula}`);

    // =========================================================================
    // Metodo para Verificar si ya existe una solicitud 'Pendiente y que esta no se "Duplique"
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
            ingresos: Number(ingresos),
            montoSolicitado: Number(monto_solicitado),
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