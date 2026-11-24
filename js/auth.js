import { obtenerUsuarios } from "./storage.js";

// Función para iniciar sesión
export function iniciarSesion(email, password) {

    // Obtenemos los usuarios registrados
    const usuarios = obtenerUsuarios();

    // Buscamos un usuario con las credenciales ingresadas
    const usuarioEncontrado = usuarios.find(usuario =>
        usuario.email === email &&
        usuario.password === password
    );

    // Comprobamos si encontramos el usuario
    if (usuarioEncontrado) {

        // Creamos los datos de la sesión
        const sesion = {
            identificacion: usuarioEncontrado.identificacion,
            nombreCompleto: usuarioEncontrado.nombreCompleto,
            email: usuarioEncontrado.email,
            cargo: usuarioEncontrado.cargo
        };

        // Guardamos la sesión
        localStorage.setItem(
            "acme_sesion",
            JSON.stringify(sesion)
        );

        return {
            correcto: true,
            usuario: sesion
        };

    }

    // Si los datos no coinciden
    return {
        correcto: false,
        usuario: null
    };

}

export function cerrarSesion() {

    // Eliminamos los datos de la sesión
    localStorage.removeItem("acme_sesion");

    console.log("Sesión cerrada correctamente");

}