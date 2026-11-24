import "./components/login-form.js";
import {
    obtenerUsuarios,
    guardarUsuarios
} from "./storage.js";

// Obtenemos los usuarios actuales
const usuariosActualizados = obtenerUsuarios();

// Comprobamos si el docente ya está registrado
const existeDocente = usuariosActualizados.some(
    usuario => usuario.email === "docente@acmeschool.com"
);

// Si no existe, lo registramos
if (!existeDocente) {

    const docente = {
        identificacion: "1000000001",
        nombreCompleto: "Carlos Rodríguez",
        email: "docente@acmeschool.com",
        telefono: "3010000000",
        cargo: "Docente",
        password: "Docente123!"
    };

    usuariosActualizados.push(docente);

    guardarUsuarios(usuariosActualizados);

    console.log("Docente registrado correctamente");

}

// Comprobamos nuestro almacenamiento
console.log("Usuarios guardados:", obtenerUsuarios());

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