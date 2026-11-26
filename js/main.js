
import "./components/login-form.js";
import "./components/app-dashboard.js";
import "./components/user-management.js";
import "./components/exam-management.js";
import "./components/question-management.js";
import "./components/public-exam-portal.js";
import "./components/exam-player.js";

import {
    cerrarSesion,
    obtenerSesion
} from "./auth.js";

import {
    obtenerUsuarios,
    guardarUsuarios
} from "./storage.js";


// ====================================
// CREAR USUARIOS INICIALES
// ====================================

const usuarios = obtenerUsuarios();

const existeAdministrador = usuarios.some(usuario =>
    usuario.email === "admin@acmeschool.com"
);

if (!existeAdministrador) {

    usuarios.push({
        identificacion: "1000000000",
        nombreCompleto: "Administrador Acme",
        email: "admin@acmeschool.com",
        telefono: "3000000000",
        cargo: "Administrativo",
        password: "Admin123!"
    });

}

const existeDocente = usuarios.some(usuario =>
    usuario.email === "docente@acmeschool.com"
);

if (!existeDocente) {

    usuarios.push({
        identificacion: "1000000001",
        nombreCompleto: "Carlos Rodríguez",
        email: "docente@acmeschool.com",
        telefono: "3010000000",
        cargo: "Docente",
        password: "Docente123!"
    });

}

guardarUsuarios(usuarios);


// ====================================
// CONTENEDOR PRINCIPAL
// ====================================

const contenedor = document.querySelector("main");


// ====================================
// MOSTRAR DASHBOARD
// ====================================

function mostrarDashboard(usuario) {

    const dashboard = document.createElement("app-dashboard");

    dashboard.setAttribute(
        "nombre",
        usuario.nombreCompleto
    );

    dashboard.setAttribute(
        "cargo",
        usuario.cargo
    );

    contenedor.replaceChildren(dashboard);
}


// ====================================
// INICIAR SESIÓN
// ====================================

contenedor.addEventListener("login-success", (event) => {

    const usuario = event.detail;

    console.log("Usuario autenticado:", usuario.nombreCompleto);

    console.log("Cargo:", usuario.cargo);

    mostrarDashboard(usuario);

});


// ====================================
// CERRAR SESIÓN
// ====================================

contenedor.addEventListener("logout-request", () => {

    cerrarSesion();

    const login = document.createElement("login-form");

    contenedor.replaceChildren(login);

});


// ====================================
// ABRIR PORTAL PÚBLICO
// ====================================

contenedor.addEventListener("public-exams-request", () => {

    const portal = document.createElement("public-exam-portal");

    contenedor.replaceChildren(portal);

});


// ====================================
// VOLVER AL LOGIN
// ====================================

contenedor.addEventListener("back-to-login", () => {

    const login = document.createElement("login-form");

    contenedor.replaceChildren(login);

});


// ====================================
// RECIBIR DATOS DEL ESTUDIANTE
// ====================================

contenedor.addEventListener("student-ready", (event) => {

    const examen = event.detail.examen;

    const estudiante = event.detail.estudiante;

    const jugador = document.createElement("exam-player");

    // IMPORTANTE: asignamos los datos antes de insertar
    // el componente para que connectedCallback los encuentre.

    jugador.examen = examen;

    jugador.estudiante = estudiante;

    contenedor.replaceChildren(jugador);

});


// ====================================
// VOLVER AL PORTAL DESDE EL EXAMEN
// ====================================

contenedor.addEventListener("back-to-portal", () => {

    const portal = document.createElement("public-exam-portal");

    contenedor.replaceChildren(portal);

});


// ====================================
// RECUPERAR SESIÓN
// ====================================

const sesionActiva = obtenerSesion();

if (sesionActiva) {

    mostrarDashboard(sesionActiva);

    console.log("Sesión recuperada correctamente");

} else {

    console.log("No existe una sesión activa");

}
