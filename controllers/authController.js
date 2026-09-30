const Usuario = require('../models/usuarioModel');

// LÓGICA PARA EL LOGIN
exports.login = (req, res) => {
    const { Cedula, password } = req.body;

    console.log(`📡 Controlador Auth: Intentando iniciar sesión para CC: ${Cedula}`);

    Usuario.buscarPorCedula(Cedula, (error, results) => {

        if (error) {
            console.error('❌ Error en el modelo al consultar Login:', error);

            if (req.is('application/json')) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error del servidor al intentar iniciar sesión',
                    error: error.code || 'DB_ERROR'
                });
            }

            return res.redirect('/Pagina_Principal.html?error=servidor');
        }

        if (results.length > 0) {

            const usuarioEncontrado = results[0];

            // Validación de la contraseña
            if (usuarioEncontrado.PASSWORD === password) {

                console.log(`✅ Login exitoso. Bienvenido, ${usuarioEncontrado.NOMBRE}`);

                // Se ajusta la ruta según el ROL guardado en la base de datos
                const esAnalista = usuarioEncontrado.ROL === 'analista';

                const rutaRedirect = esAnalista
                    ? '/Vista_Analista.html'
                    : '/Solicitud_de_credito.html';

                if (req.is('application/json')) {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Login exitoso',
                        redirect: rutaRedirect,
                        usuario: {
                            Cedula: usuarioEncontrado.ID_USUARIO,
                            Nombre: usuarioEncontrado.NOMBRE,
                            email: usuarioEncontrado.EMAIL,
                            rol: usuarioEncontrado.ROL || 'cliente'
                        }
                    });
                }

                return res.redirect(rutaRedirect);

            } else {

                console.log('❌ Login fallido: Contraseña incorrecta.');

                if (req.is('application/json')) {
                    return res.status(401).json({
                        ok: false,
                        mensaje: 'Contraseña incorrecta'
                    });
                }

                return res.redirect('/Pagina_Principal.html?error=datos_incorrectos');
            }

        } else {

            console.log('❌ Login fallido: El usuario no existe.');

            if (req.is('application/json')) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'El usuario no existe'
                });
            }

            return res.redirect('/Pagina_Principal.html?error=usuario_no_existe');
        }
    });
};


// LÓGICA DE REGISTRO DE USUARIO
exports.registrar = (req, res) => {

    const {
        Nombre,
        Cedula,
        email,
        telefono,
        password,
        confirmPassword
    } = req.body;

    console.log(`📡 Intentando registrar a: ${Nombre} (CC: ${Cedula})`);

    // Validamos que las contraseñas coincidan
    if (password && password === confirmPassword) {

        const nuevoUsuario = {
            Nombre,
            Cedula,
            email,
            telefono,
            password,
            rol: 'cliente'
        };

        Usuario.crear(nuevoUsuario, (error, results) => {

            if (error) {

                console.error(
                    '❌ Error real en el modelo de MySQL al registrar:',
                    error
                );

                if (req.is('application/json')) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al registrar el usuario',
                        error: error.code || 'DB_ERROR'
                    });
                }

                return res.redirect(
                    '/Registro_de_usuario.html?error=formulario'
                );
            }

            console.log(`✅ ¡Usuario ${Nombre} guardado con éxito en MySQL!`);

            if (req.is('application/json')) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Usuario registrado correctamente',
                    usuario: {
                        Cedula,
                        Nombre,
                        email,
                        telefono,
                        rol: 'cliente'
                    }
                });
            }

            return res.redirect('/Pagina_Principal.html?registro=exito');
        });

    } else {

        console.log(
            '❌ Error: Las contraseñas digitadas NO coinciden en el formulario.'
        );

        return res.redirect(
            '/Registro_de_usuario.html?error=claves_no_coinciden'
        );
    }
};


// LÓGICA PARA RECUPERAR CONTRASEÑA
exports.recuperarPassword = (req, res) => {

    const {
        Cedula,
        email,
        nuevaPassword,
        confirmPassword
    } = req.body;

    console.log(
        `📡 Controlador Auth: Solicitud de recuperación de contraseña para CC: ${Cedula}`
    );

    if (!Cedula || !email || !nuevaPassword || !confirmPassword) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    if (nuevaPassword !== confirmPassword) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Las contraseñas no coinciden'
        });
    }

    if (nuevaPassword.length < 6) {
        return res.status(400).json({
            ok: false,
            mensaje: 'La contraseña debe tener al menos 6 caracteres'
        });
    }

    Usuario.buscarPorCedulaYEmail(
        Cedula,
        email,
        (error, results) => {

            if (error) {
                console.error(
                    '❌ Error al validar datos de recuperación:',
                    error
                );

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error del servidor al validar los datos'
                });
            }

            if (results.length === 0) {

                console.log(
                    '❌ Recuperación fallida: cédula y correo no coinciden.'
                );

                return res.status(404).json({
                    ok: false,
                    mensaje:
                        'La cédula y el correo no coinciden con ningún usuario registrado'
                });
            }

            Usuario.actualizarPassword(
                Cedula,
                nuevaPassword,
                (errorUpdate) => {

                    if (errorUpdate) {

                        console.error(
                            '❌ Error al actualizar la contraseña:',
                            errorUpdate
                        );

                        return res.status(500).json({
                            ok: false,
                            mensaje:
                                'No se pudo actualizar la contraseña'
                        });
                    }

                    console.log(
                        `✅ Contraseña actualizada para ${results[0].NOMBRE}`
                    );

                    return res.status(200).json({
                        ok: true,
                        mensaje:
                            'Contraseña actualizada correctamente'
                        }
                    });
                };

    
   // 🔄 NUEVA LÓGICA: ACTUALIZAR EL PERFIL DE USUARIO
exports.actualizarPerfil = (req, res) => {
    // Obtenemos la cédula guardada en la sesión del usuario logueado
    const idUsuario = req.session ? req.session.cedula : null; 
    
    // Recibimos los nuevos datos desde el formulario de perfil
    const { Nombre, Apellido, email, telefono } = req.body;

    // 1. Validación de sesión activa
    if (!idUsuario) {
        return res.status(401).json({ error: "No autorizado. Por favor, inicia sesión nuevamente." });
    }

    // 2. Validación de campos obligatorios
    if (!Nombre || !email) {
        return res.status(400).json({ error: "El nombre y el correo electrónico son campos obligatorios." });
    }

    // 3. Llamado al modelo para actualizar en MySQL
    Usuario.actualizarDatosPerfil(idUsuario, { Nombre, Apellido, email, telefono }, (err, resultado) => {
        if (err) {
            console.error("❌ Error en el controlador al intentar actualizar perfil:", err);
            return res.status(500).json({ error: "Error interno en el servidor al intentar actualizar los datos." });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró el registro del usuario en el sistema." });
        }

        console.log(`✅ ¡Perfil de la CC ${idUsuario} actualizado correctamente!`);
        return res.status(200).json({ mensaje: "¡Perfil actualizado con éxito!" });
    });
};
     
    
            
