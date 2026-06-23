// controllers/authController.js
const Usuario = require('../models/usuarioModel'); 

// LÓGICA PARA EL LOGIN
exports.login = (req, res) => {
    const { Cedula, password } = req.body;
    console.log(`📡 Controlador Auth: Intentando iniciar sesión para CC: ${Cedula}`);

    Usuario.buscarPorCedula(Cedula, (error, results) => {
        if (error) {
            console.error('❌ Error en el modelo al consultar Login:', error);
            return res.redirect('/Pagina_Principal.html?error=servidor');
        }

        if (results.length > 0) {
            const usuarioEncontrado = results[0];
            
            // Validacion de  la contraseña
            if (usuarioEncontrado.PASSWORD === password) {
                console.log(`✅ Login exitoso. Bienvenido, ${usuarioEncontrado.NOMBRE}`);
                return res.redirect('/Solicitud_de_credito.html'); 
            } else {
                console.log('❌ Login fallido: Contraseña incorrecta.');
                return res.redirect('/Pagina_Principal.html?error=datos_incorrectos');
            }
        } else {
            console.log('❌ Login fallido: El usuario no existe.');
            return res.redirect('/Pagina_Principal.html?error=usuario_no_existe');
        }
    });
};

// 📝 LÓGICA PARA EL REGISTRO DE USUARIO
exports.registrar = (req, res) => {
    const { Nombre, Cedula, email, telefono, password, confirmPassword } = req.body;
    console.log(`📡 Controlador Auth: Procesando registro para ${Nombre}`);

    // Validar  que las contraseñas coincidan
    if (password && password === confirmPassword) {
        const nuevoUsuario = { Nombre, Cedula, email, telefono, password };

        Usuario.crear(nuevoUsuario, (error, results) => {
            if (error) {
                console.error('❌ Error en el modelo al registrar usuario:', error);
                return res.redirect('/Registro_de_usuario.html?error=formulario');
            }
            console.log(`✅ Usuario ${Nombre} registrado con éxito en la BD.`);
            return res.redirect('/Pagina_Principal.html?registro=exito');
        });
    } else {
        console.log('❌ Registro fallido: Las contraseñas no coinciden.');
        return res.redirect('/Registro_de_usuario.html?error=claves_no_coinciden');
    }
};