const CLAVE_USUARIOS = "acme_usuarios";
const CLAVE_EXAMENES = "acme_examenes";

export function obtenerUsuarios() {

    const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);

    if (usuariosGuardados) {
        return JSON.parse(usuariosGuardados);
    }

    return [];
}

// Función para guardar los usuarios
export function guardarUsuarios(usuarios) {

    localStorage.setItem(
        CLAVE_USUARIOS,
        JSON.stringify(usuarios)
    );

}

// Función para obtener los exámenes
export function obtenerExamenes() {

    // Buscamos los exámenes guardados
    const examenesGuardados =
        localStorage.getItem(CLAVE_EXAMENES);

    // Comprobamos si existen exámenes
    if (examenesGuardados) {

        return JSON.parse(examenesGuardados);

    }

    // Si no existen, devolvemos un arreglo vacío
    return [];

}

export function guardarExamenes(examenes) {

    localStorage.setItem(
        CLAVE_EXAMENES,
        JSON.stringify(examenes)
    );

}