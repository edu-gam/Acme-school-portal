import { obtenerUsuarios } from "../storage.js";

class UserManagement extends HTMLElement {

    constructor() {
        super();

        // Creamos el Shadow DOM
        this.attachShadow({ mode: "open" });
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

            acciones.textContent = "Próximamente";

            fila.appendChild(acciones);

            // Agregamos la fila a la tabla
            listaUsuarios.appendChild(fila);

        });

    }

}


// Registramos nuestro componente
customElements.define("user-management", UserManagement);