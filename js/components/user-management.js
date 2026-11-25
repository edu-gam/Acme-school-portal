import {
    obtenerUsuarios,
    guardarUsuarios
} from "../storage.js";

class UserManagement extends HTMLElement {

    constructor() {
        super();

        // Creamos el Shadow DOM
        this.attachShadow({ mode: "open" });

        // Identificación del usuario que estamos editando
        this.identificacionEditando = null;
    }

    connectedCallback() {

        // Construimos el contenido
        this.shadowRoot.innerHTML = `

            <style>

                :host {
                    display: block;
                    width: 100%;
                }

                .users-container {
                    width: 100%;
                    padding: 25px;
                    background-color: white;
                    border-radius: 12px;
                }

                h2 {
                    color: #174ea6;
                    margin-bottom: 10px;
                }

                h3 {
                    color: #174ea6;
                    margin-bottom: 20px;
                }

                p {
                    color: #64748b;
                    margin-bottom: 25px;
                }

                /* FORMULARIO */

                .formulario {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-bottom: 35px;
                }

                .campo {
                    display: flex;
                    flex-direction: column;
                }

                label {
                    font-weight: bold;
                    color: #334155;
                    margin-bottom: 8px;
                }

                input, select {
                    padding: 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 7px;
                    font-size: 14px;
                }

                input:focus, select:focus {
                    outline: 2px solid #1769e0;
                    border-color: transparent;
                }

                button {
                    padding: 12px;
                    background-color: #1769e0;
                    color: white;
                    border: none;
                    border-radius: 7px;
                    cursor: pointer;
                    font-weight: bold;
                }

                button:hover {
                    background-color: #1053b5;
                }

                /* TABLA */

                .tabla-container {
                    width: 100%;
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    padding: 13px;
                    border-bottom: 1px solid #e2e8f0;
                    text-align: left;
                    font-size: 14px;
                }

                th {
                    background-color: #eff6ff;
                    color: #174ea6;
                }

                .mensaje-vacio {
                    text-align: center;
                    color: #64748b;
                }

                /* RESPONSIVE */

                @media (max-width: 600px) {

                    .formulario {
                        grid-template-columns: 1fr;
                    }

                    .users-container {
                        padding: 15px;
                    }

                }

            </style>


            <div class="users-container">

                <h2>Gestión de usuarios</h2>

                <p>
                    Registra y administra los usuarios
                    de Acme School.
                </p>


                <!-- FORMULARIO DE USUARIOS -->

                <h3>Registrar nuevo usuario</h3>

                <form class="formulario" id="formularioUsuario">

                    <div class="campo">

                        <label for="identificacion">
                            Número de identificación
                        </label>

                        <input
                            type="text"
                            id="identificacion"
                            placeholder="Ej: 1000000002"
                            required
                        >

                    </div>


                    <div class="campo">

                        <label for="nombre">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            id="nombre"
                            placeholder="Nombre del usuario"
                            required
                        >

                    </div>


                    <div class="campo">

                        <label for="email">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            id="email"
                            placeholder="correo@ejemplo.com"
                            required
                        >

                    </div>


                    <div class="campo">

                        <label for="telefono">
                            Teléfono
                        </label>

                        <input
                            type="tel"
                            id="telefono"
                            placeholder="Número de teléfono"
                            required
                        >

                    </div>


                    <div class="campo">

                        <label for="cargo">
                            Cargo
                        </label>

                        <select id="cargo" required>

                            <option value="" disabled selected>
                                Selecciona un cargo
                            </option>

                            <option value="Administrativo">
                                Administrativo
                            </option>

                            <option value="Docente">
                                Docente
                            </option>

                        </select>

                    </div>


                    <div class="campo">

                        <label for="password">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Crear contraseña"
                            required
                        >

                    </div>


                    <button type="submit">
                        Registrar usuario
                    </button>

                </form>

                <p id="mensajeFormulario" role="status" aria-live="polite"></p>

                <!-- TABLA DE USUARIOS -->

                <h3>Usuarios registrados</h3>

                <div class="tabla-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Identificación</th>

                                <th>Nombre</th>

                                <th>Email</th>

                                <th>Teléfono</th>

                                <th>Cargo</th>

                                <th>Acciones</th>

                            </tr>

                        </thead>


                        <tbody id="listaUsuarios">

                            <tr>

                                <td colspan="6" class="mensaje-vacio">
                                    Todavía no hay usuarios cargados.
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        `;

this.mostrarUsuarios();

    const formulario =
        this.shadowRoot.querySelector("#formularioUsuario");

    // Escuchamos cuando se envía el formulario
    formulario.addEventListener("submit", (event) => {

        // Evitamos que la página se recargue
        event.preventDefault();

        // Obtenemos los datos del formulario
        const identificacion = this.shadowRoot
            .querySelector("#identificacion").value.trim();

        const nombreCompleto = this.shadowRoot
            .querySelector("#nombre").value.trim();

        const email = this.shadowRoot
            .querySelector("#email").value.trim().toLowerCase();

        const telefono = this.shadowRoot
            .querySelector("#telefono").value.trim();

        const cargo = this.shadowRoot
            .querySelector("#cargo").value;

        const password = this.shadowRoot
            .querySelector("#password").value;

        // Obtenemos los usuarios actuales
        const usuarios = obtenerUsuarios();


        // Comprobamos si ya existe la identificación o el correo
        const usuarioExistente = usuarios.some(usuario => {

            // Comprobamos que no sea el usuario que estamos editando
            const esOtroUsuario =
                usuario.identificacion !== this.identificacionEditando;

            const mismaIdentificacion =
                usuario.identificacion === identificacion;

            const mismoCorreo =
                (usuario.email || "").toLowerCase() === email;

            return esOtroUsuario &&
                (mismaIdentificacion || mismoCorreo);

        });

        // Seleccionamos el espacio de mensajes
        const mensaje =
            this.shadowRoot.querySelector("#mensajeFormulario");

        // Comprobamos si el usuario ya existe
        if (usuarioExistente) {

            mensaje.textContent =
                "El correo o la identificación ya están registrados.";

            mensaje.style.color = "#dc2626";

            return;

        }

        // Creamos el objeto con los datos del formulario
        const usuarioFormulario = {
            identificacion,
            nombreCompleto,
            email,
            telefono,
            cargo,
            password
        };

        // Comprobamos si estamos editando
        const estabaEditando =
            this.identificacionEditando !== null;

        if (estabaEditando) {

            // Buscamos el usuario original
            const indiceUsuario = usuarios.findIndex(usuario =>
                usuario.identificacion === this.identificacionEditando
            );

            // Comprobamos si encontramos el registro
            if (indiceUsuario === -1) {

                mensaje.textContent =
                    "No se encontró el usuario que deseas editar.";

                mensaje.style.color = "#dc2626";

                return;

            }

            // Actualizamos el usuario
            usuarios[indiceUsuario] = usuarioFormulario;

        } else {

            // Registramos un usuario nuevo
            usuarios.push(usuarioFormulario);

        }

        // Guardamos los cambios en localStorage
        guardarUsuarios(usuarios);

        // Actualizamos la tabla
        this.mostrarUsuarios();

        // Limpiamos el formulario
        formulario.reset();

        // Reiniciamos el modo de edición
        this.identificacionEditando = null;

        // Restauramos el texto del botón
        const boton = this.shadowRoot.querySelector(
            "#formularioUsuario button[type='submit']"
        );

        boton.textContent = "Registrar usuario";

        // Mostramos el mensaje correspondiente
        if (estabaEditando) {

            mensaje.textContent =
                "¡Usuario actualizado correctamente!";

        } else {

            mensaje.textContent =
                "¡Usuario registrado correctamente!";

        }

        mensaje.style.color = "#15803d";

        console.log(
            estabaEditando
                ? "Usuario actualizado:"
                : "Nuevo usuario registrado:",
            nombreCompleto
        );

    });

}


    // Función para mostrar usuarios
    mostrarUsuarios() {

        // Obtenemos los usuarios guardados
        const usuarios = obtenerUsuarios();

        // Seleccionamos la tabla
        const listaUsuarios =
            this.shadowRoot.querySelector("#listaUsuarios");

        // Limpiamos el contenido anterior
        listaUsuarios.replaceChildren();

        // Comprobamos si existen usuarios
        if (usuarios.length === 0) {

            const fila = document.createElement("tr");

            const celda = document.createElement("td");

            celda.textContent = "No hay usuarios registrados";

            celda.colSpan = 6;

            fila.appendChild(celda);

            listaUsuarios.appendChild(fila);

            return;
        }

        // Recorremos los usuarios registrados
        usuarios.forEach(usuario => {

            // Creamos una nueva fila
            const fila = document.createElement("tr");

            // Datos que mostraremos en la tabla
            const datos = [
                usuario.identificacion,
                usuario.nombreCompleto,
                usuario.email,
                usuario.telefono,
                usuario.cargo
            ];

            // Creamos una celda para cada dato
            datos.forEach(dato => {

                const celda = document.createElement("td");

                celda.textContent = dato;

                fila.appendChild(celda);

            });

            // Creamos la celda de acciones
            const acciones = document.createElement("td");

            // Creamos el botón Editar
            const botonEditar = document.createElement("button");

            botonEditar.textContent = "Editar";

            botonEditar.type = "button";

            // Escuchamos cuando se presiona Editar
            botonEditar.addEventListener("click", () => {

                this.editarUsuario(usuario.identificacion);

            });

            // Agregamos el botón a la celda
            acciones.appendChild(botonEditar);

            fila.appendChild(acciones);

            // AGREGAMOS LA FILA A LA TABLA
            listaUsuarios.appendChild(fila);

        });

    }


    // Función para cargar los datos de un usuario
    editarUsuario(identificacion) {

        // Obtenemos los usuarios registrados
        const usuarios = obtenerUsuarios();

        // Buscamos el usuario seleccionado
        const usuario = usuarios.find(usuario =>
            usuario.identificacion === identificacion
        );

        // Comprobamos si existe
        if (!usuario) {
            return;
        }

        // Guardamos la identificación original
        this.identificacionEditando = identificacion;

        // Cargamos los datos en el formulario
        this.shadowRoot.querySelector("#identificacion").value =
            usuario.identificacion;

        this.shadowRoot.querySelector("#nombre").value =
            usuario.nombreCompleto;

        this.shadowRoot.querySelector("#email").value =
            usuario.email;

        this.shadowRoot.querySelector("#telefono").value =
            usuario.telefono;

        this.shadowRoot.querySelector("#cargo").value =
            usuario.cargo;

        this.shadowRoot.querySelector("#password").value =
            usuario.password;

        // Cambiamos el texto del botón
        const boton = this.shadowRoot.querySelector(
            "#formularioUsuario button[type='submit']"
        );

        boton.textContent = "Guardar cambios";

        // Mostramos un mensaje
        const mensaje =
            this.shadowRoot.querySelector("#mensajeFormulario");

        mensaje.textContent =
            "Estás editando a " + usuario.nombreCompleto;

        mensaje.style.color = "#1769e0";

    }

}

// Fin de la clase UserManagement

if (!customElements.get("user-management")) {

    // Registramos nuestro componente
    customElements.define("user-management", UserManagement);

}