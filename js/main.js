import "./components/login-form.js";
import {
    obtenerUsuarios,
    guardarUsuarios
} from "./storage.js";

// Comprobamos nuestro almacenamiento
console.log("Usuarios guardados:", obtenerUsuarios());

// Comprobamos si existen usuarios registrados
const usuarios = obtenerUsuarios();

// Si no existen usuarios, creamos el administrador
if (usuarios.length === 0) {

    const administrador = {
        identificacion: "1000000000",
        nombreCompleto: "Administrador Acme",
        email: "admin@acmeschool.com",
        telefono: "3000000000",
        cargo: "Administrativo",
        password: "Admin123!"
    };

    // Guardamos el administrador
    guardarUsuarios([administrador]);

    console.log("Administrador creado correctamente");

}

// Mostramos los usuarios registrados
console.log("Usuarios guardados:", obtenerUsuarios());