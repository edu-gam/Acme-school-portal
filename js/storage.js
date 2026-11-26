
const CLAVE_USUARIOS = "acme_usuarios";
const CLAVE_EXAMENES = "acme_examenes";

// Obtener usuarios
export function obtenerUsuarios() {

    const datos = localStorage.getItem(CLAVE_USUARIOS);

    return datos ? JSON.parse(datos) : [];

}

// Guardar usuarios
export function guardarUsuarios(usuarios) {

    localStorage.setItem(
        CLAVE_USUARIOS,
        JSON.stringify(usuarios)
    );

}

// Obtener exámenes
export function obtenerExamenes() {

    const datos = localStorage.getItem(CLAVE_EXAMENES);

    return datos ? JSON.parse(datos) : [];

}

// Guardar exámenes
export function guardarExamenes(examenes) {

    localStorage.setItem(
        CLAVE_EXAMENES,
        JSON.stringify(examenes)
    );

}
