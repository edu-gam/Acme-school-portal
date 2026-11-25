import "./components/login-form.js";
import "./components/app-dashboard.js";
import {
    cerrarSesion,
    obtenerSesion
} from "./auth.js";
import "./components/user-management.js";

import {
    obtenerUsuarios,
    guardarUsuarios
} from "./storage.js";

// OBTENER USUARIOS REGISTRADOS
const usuarios = obtenerUsuarios();

const existeAdministrador = usuarios.some(
    usuario => usuario.email === "admin@acmeschool.com"
);

if (!existeAdministrador) {

    const administrador = {
        identificacion: "1000000000",
        nombreCompleto: "Administrador Acme",
        email: "admin@acmeschool.com",
        telefono: "3000000000",
        cargo: "Administrativo",
        password: "Admin123!"
    };

    usuarios.push(administrador);

    console.log("Administrador registrado correctamente");

}

const existeDocente = usuarios.some(
    usuario => usuario.email === "docente@acmeschool.com"
);

if (!existeDocente) {

    const docente = {
        identificacion: "1000000001",
        nombreCompleto: "Carlos Rodríguez",
        email: "docente@acmeschool.com",
        telefono: "3010000000",
        cargo: "Docente",
        password: "Docente123!"
    };

    usuarios.push(docente);

    console.log("Docente registrado correctamente");

}

// GUARDAR USUARIOS
guardarUsuarios(usuarios);

console.log("Usuarios guardados:", obtenerUsuarios());


// ESCUCHAR EVENTO DE LOGIN
const contenedor = document.querySelector("main");

// Escuchamos el inicio de sesión
contenedor.addEventListener("login-success", (event) => {

    // Obtenemos los datos del usuario
    const usuario = event.detail;

    console.log("Usuario autenticado:", usuario.nombreCompleto);

    console.log("Cargo:", usuario.cargo);

    // Mostramos el Dashboard
    mostrarDashboard(usuario);

});

function mostrarDashboard(usuario) {

    // Creamos el componente
    const dashboard = document.createElement("app-dashboard");

    // Enviamos los datos del usuario
    dashboard.setAttribute("nombre", usuario.nombreCompleto);

    dashboard.setAttribute("cargo", usuario.cargo);

    // Mostramos el Dashboard
    contenedor.replaceChildren(dashboard);

}

contenedor.addEventListener("logout-request", () => {

    // Cerramos la sesión
    cerrarSesion();

    const login = document.createElement("login-form");

    // Reemplazamos el Dashboard por el Login
    contenedor.replaceChildren(login);

});

// Comprobamos si existe una sesión activa
const sesionActiva = obtenerSesion();

// Si existe una sesión, mostramos el Dashboard
if (sesionActiva) {

    mostrarDashboard(sesionActiva);

    console.log("Sesión recuperada correctamente");

} else {

    console.log("No existe una sesión activa");

}

customElements.define("user-management", UserManagement);