// controllers/authController.js
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
            
            // Validacion de la contraseña
            if (usuarioEncontrado.PASSWORD === password) {
                console.log(`✅ Login exitoso. Bienvenido, ${usuarioEncontrado.NOMBRE}`);
                if (req.is('application/json')) {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Login exitoso',
                        usuario: {
                            Cedula: usuarioEncontrado.ID_USUARIO,
                            Nombre: usuarioEncontrado.NOMBRE,
                            email: usuarioEncontrado.EMAIL
                        }
                    });
                }
                return res.redirect('/Solicitud_de_credito.html');
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

// 📝 LÓGICA DE REGISTRO USUARIO    
exports.registrar = (req, res) => {
    const { Nombre, Cedula, email, telefono, password, confirmPassword } = req.body;
    
    console.log(`📡 Intentando registrar a: ${Nombre} (CC: ${Cedula})`);
    console.log(`🔑 Contraseña: ${password} | Confirmación: ${confirmPassword}`);

    // 1. Validamos que las contraseñas coincidan
    if (password && password === confirmPassword) {
        const nuevoUsuario = { Nombre, Cedula, email, telefono, password };

        Usuario.crear(nuevoUsuario, (error, results) => {
            if (error) {
                console.error('❌ Error real en el modelo de MySQL al registrar:', error);
                if (req.is('application/json')) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al registrar el usuario',
                        error: error.code || 'DB_ERROR'
                    });
                }
                // Si falla la inserción en la BD, los regresa al formulario
                return res.redirect('/Registro_de_usuario.html?error=formulario');
            }
            console.log(`✅ ¡Usuario ${Nombre} guardado con éxito en MySQL!`);
            if (req.is('application/json')) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Usuario registrado correctamente',
                    usuario: { Cedula, Nombre, email, telefono }
                });
            }
            return res.redirect('/Pagina_Principal.html?registro=exito');
        });
    } else {
        console.log('❌ Error: Las contraseñas digitadas NO coinciden en el formulario.');
        return res.redirect('/Registro_de_usuario.html?error=claves_no_coinciden');
    }
};