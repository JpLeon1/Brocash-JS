// const Usuario = require('../models/usuarioModel'); 

// BASE DE DATOS DE USUARIOS
const usuariosSimuladosDB = [
    {
        NOMBRE: "Juan Pablo Leon",
        CEDULA: "1014298336", // Puedes cambiar esta CC por la que uses siempre para probar
        PASSWORD: "123456"   // Puedes cambiar esta clave por la que quieras
    }
];

// 🔑 LÓGICA PARA EL LOGIN (SIMULADO)
exports.login = (req, res) => {
    const { Cedula, password } = req.body;
    console.log(`📡 Controlador Auth (Simulado): Intentando iniciar sesión para CC: ${Cedula}`);

    // Buscamos directamente en nuestro arreglo temporal en vez de ir a MySQL
    const usuarioEncontrado = usuariosSimuladosDB.find(u => u.CEDULA === Cedula);

    if (usuarioEncontrado) {
        // Validación de la contraseña
        if (usuarioEncontrado.PASSWORD === password) {
            console.log(`✅ Login exitoso. Bienvenido, ${usuarioEncontrado.NOMBRE}`);
            return res.redirect('/Solicitud_de_credito.html'); 
        } else {
            console.log('❌ Login fallido: Contraseña incorrecta.');
            return res.redirect('/Pagina_Principal.html?error=datos_incorrectos');
        }
    } else {
        console.log('❌ Login fallido: El usuario no existe en la simulación.');
        return res.redirect('/Pagina_Principal.html?error=usuario_no_existe');
    }
};

// 📝 LÓGICA DE REGISTRO USUARIO (SIMULADO)   
exports.registrar = (req, res) => {
    const { Nombre, Cedula, email, telefono, password, confirmPassword } = req.body;
    
    console.log(`📡 Intentando registrar a: ${Nombre} (CC: ${Cedula})`);

    // 1. Validamos que las contraseñas coincidan
    if (password && password === confirmPassword) {
        
        // Guardamos el nuevo usuario en el arreglo de memoria para que puedas loguearte de una vez
        usuariosSimuladosDB.push({
            NOMBRE: Nombre,
            CEDULA: Cedula,
            PASSWORD: password
        });

        console.log(`✅ ¡Usuario ${Nombre} guardado con éxito en la memoria temporal! Redirigiendo...`);
        return res.redirect('/Pagina_Principal.html?registro=exito');
        
    } else {
        console.log('❌ Error: Las contraseñas digitadas NO coinciden en el formulario.');
        return res.redirect('/Registro_de_usuario.html?error=claves_no_coinciden');
    }
};