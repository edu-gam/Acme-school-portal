const CLAVE_USUARIOS = "acme_usuarios";

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