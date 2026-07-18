// const Credito = require('../models/creditoModel'); evita caidas sin XAMPP


const creditosSimuladosDB = [
    {
        ID_CREDITO: 458712,
        CEDULA: 12345,
        ID_ANALISTA: 1020856325,
        INGRESOS: 2500000,
        MONTO_SOLICITADO: 5000000,
        ESTADO: 'Pendiente',
        NOMBRE: 'Juan Pablo Leon Pineda',
        EMAIL: 'juan@correo.com',
        OCUPACION: 'Desarrollador',
        TELEFONO: '3001234567',
        FECHA_SOLICITUD: '2026-07-18'
    }
];

// 1. Método CREATE: Procesar la Solicitud de Crédito (SIMULADO)
exports.procesarSolicitud = (req, res) => {
    const { Nombre, Cedula, email, ocupacion, telefono, ingresos_mensuales, monto_Solicitado, fechaSolicitud } = req.body;
    console.log(`📡 Controlador (Simulado): Validando solicitud para cédula ${Cedula}`);

    // Buscamos si ya tiene un crédito 'Pendiente' en nuestro arreglo
    const tienePendiente = creditosSimuladosDB.some(c => c.CEDULA === Number(Cedula) && c.ESTADO === 'Pendiente');

    if (tienePendiente) {
        console.log(`⚠️ Bloqueado: El usuario ya tiene un crédito en estudio.`);
        return res.send(`
            <script>
                alert("⚠️ Lo sentimos, ya cuentas con una solicitud de crédito en estado 'Pendiente'. Debes esperar a que el analista la evalúe.");
                window.location.href = "javascript:history.back()"; 
            </script>
        `);
    }
    
    const idCredito = Math.floor(100000 + Math.random() * 900000); 
    const idAnalista = 1020856325; 
    const estado = 'Pendiente'; 

    // Insertamos el nuevo objeto al arreglo en memoria
    creditosSimuladosDB.push({
        ID_CREDITO: idCredito,
        CEDULA: Number(Cedula),
        ID_ANALISTA: idAnalista,
        INGRESOS: Number(ingresos_mensuales),
        MONTO_SOLICITADO: Number(monto_Solicitado),
        ESTADO: estado, 
        NOMBRE: Nombre,
        EMAIL: email,
        OCUPACION: ocupacion,
        TELEFONO: telefono,
        FECHA_SOLICITUD: fechaSolicitud
    });

    console.log(`✅ Solicitud N° ${idCredito} guardada exitosamente en memoria temporal.`);
    
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
};

// 2. Metodo READ: Mostrar todos los créditos en la tabla del Analista (SIMULADO)
exports.listarCreditos = (req, res) => {
    // Mapeamos los datos para asegurar que respondan con la estructura exacta que espera el frontend
    const rows = creditosSimuladosDB.map(c => ({
        ID_CREDITO: c.ID_CREDITO,
        ID_USUARIO: c.CEDULA,
        INGRESOS: c.INGRESOS,
        MONTO_SOLICITADO: c.MONTO_SOLICITADO,
        ESTADO: c.ESTADO,
        NOMBRE: c.NOMBRE,
        EMAIL: c.EMAIL,
        OCUPACION: c.OCUPACION,
        TELEFONO: c.TELEFONO,
        FECHA_SOLICITUD: c.FECHA_SOLICITUD
    }));
    res.json(rows); 
};

// 3. Metodo UPDATE: Modificar el estado de un crédito y desembolsar si es aprobado (SIMULADO)
exports.modificarEstado = (req, res) => {
    const { idCredito, nuevoEstado } = req.body;
    
    const credito = creditosSimuladosDB.find(c => c.ID_CREDITO === Number(idCredito));

    if (!credito) {
        console.error('❌ Error: Crédito no encontrado en memoria.');
        return res.redirect('/Vista_Analista.html?update=error');
    }

    credito.ESTADO = nuevoEstado;
    console.log(`✅ Crédito N° ${idCredito} actualizado a: ${nuevoEstado} en memoria`);

    if (nuevoEstado.toLowerCase() === 'aprobado') {
        console.log(`💵 ¡DESEMBOLSO EXITOSO! (Simulado) Se cargaron $${credito.MONTO_SOLICITADO} al saldo del usuario CC: ${credito.CEDULA}`);
    }
    
    return res.redirect('/Vista_Analista.html?update=exito');
};

// 4. Metodo DELETE: Eliminar físicamente el registro (SIMULADO)
exports.borrarCredito = (req, res) => {
    const { idCredito } = req.body;

    const index = creditosSimuladosDB.findIndex(c => c.ID_CREDITO === Number(idCredito));
    if (index !== -1) {
        creditosSimuladosDB.splice(index, 1);
        console.log(`🗑️ Crédito N° ${idCredito} eliminado con éxito de la memoria`);
    }
    res.redirect('/Vista_Analista.html?delete=exito');
};

// 5. Metodo READ: para que el usuario pueda ver el estado del crédito por cédula (SIMULADO)
exports.obtenerEstadoUsuario = (req, res) => {
    const { cedula } = req.params;

    const solicitudes = creditosSimuladosDB.filter(c => c.CEDULA === Number(cedula));
    
    if (solicitudes.length === 0) {
        return res.json({ tieneCredito: false });
    }

    res.json({
        tieneCredito: true,
        idCredito: solicitudes[0].ID_CREDITO,
        estado: solicitudes[0].ESTADO,
        montoSolicitado: solicitudes[0].MONTO_SOLICITADO
    });
};