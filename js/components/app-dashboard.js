// Creamos nuestro componente Dashboard

class AppDashboard extends HTMLElement {

    constructor() {
        super();

        // Creamos el Shadow DOM
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        // Obtenemos los datos del usuario
        const nombre = this.getAttribute("nombre") || "Usuario";
        const cargo = this.getAttribute("cargo") || "";

        // Construimos el contenido del Dashboard
        this.shadowRoot.innerHTML = `

            <style>

                :host {
                    display: block;
                    width: 100%;
                    min-height: 100vh;
                }

                .dashboard {
                    width: 100%;
                    min-height: 100vh;

                    display: grid;
                    grid-template-columns: 240px minmax(0, 1fr);

                    background-color: #f4f7fc;
                    font-family: Arial, sans-serif;
                    overflow: hidden;
                }

                /* MENU LATERAL */

                .sidebar {
                    background-color: #174ea6;
                    color: white;
                    padding: 25px;
                }

                .sidebar h2 {
                    margin-bottom: 10px;
                }

                .sidebar p {
                    font-size: 13px;
                    color: #dbeafe;
                }

                .menu {
                    margin-top: 40px;
                }

                .menu a {
                    display: block;
                    padding: 14px;
                    margin-bottom: 10px;

                    color: white;
                    text-decoration: none;
                    border-radius: 7px;
                }

                .menu a:hover {
                    background-color: #2563eb;
                }

                .menu a.activo {
                    background-color: #2563eb;
                    font-weight: bold;
                }

                /* CONTENIDO PRINCIPAL */

                .content {
                    padding: 30px;
                    min-width: 0;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    gap: 15px;
                }

                .user-info {
                    text-align: right;
                }

                .user-info strong {
                    display: block;
                    color: #174ea6;
                }

                .user-info span {
                    font-size: 13px;
                    color: #64748b;
                }

                /* BOTON CERRAR SESION */

                .user-info button {
                    margin-top: 10px;
                    padding: 9px 15px;

                    background-color: white;
                    color: #174ea6;

                    border: 1px solid #174ea6;
                    border-radius: 6px;

                    cursor: pointer;
                    font-weight: bold;
                }

                .user-info button:hover {
                    background-color: #174ea6;
                    color: white;
                }

                /* BIENVENIDA */

                .welcome h1 {
                    color: #1e293b;
                    margin-bottom: 10px;
                }

                .welcome p {
                    color: #64748b;
                }

                /* TARJETAS */

                .cards {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-top: 35px;
                }

                .card {
                    background-color: white;
                    padding: 25px;
                    border-radius: 12px;

                    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
                }

                .card h3 {
                    color: #174ea6;
                    margin-bottom: 12px;
                }

                .card p {
                    font-size: 14px;
                    line-height: 1.5;
                }

                /* DISEÑO RESPONSIVE */

                @media (max-width: 700px) {

                    .dashboard {
                        grid-template-columns: 1fr;
                    }

                    .sidebar {
                        padding: 20px;
                    }

                    .menu {
                        margin-top: 15px;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 5px;
                    }

                    .menu a {
                        margin: 0;
                    }

                    .content {
                        padding: 20px;
                    }

                    .cards {
                        grid-template-columns: 1fr;
                    }

                    .header {
                        align-items: flex-start;
                    }

                }

            </style>


            <!-- ESTRUCTURA DEL DASHBOARD -->

            <div class="dashboard">

                <!-- MENU LATERAL -->

                <aside class="sidebar">

                    <h2>Acme School</h2>

                    <p>Plataforma educativa</p>

                    <nav class="menu">

                        <a href="#" data-seccion="inicio" class="activo">
                            Inicio
                        </a>

                        <a href="#" data-seccion="usuarios">
                            Usuarios
                        </a>

                        <a href="#" data-seccion="examenes">
                            Exámenes
                        </a>

                    </nav>

                </aside>


                <!-- CONTENIDO PRINCIPAL -->

                <section class="content">

                    <header class="header">

                        <h2>Panel principal</h2>

                        <div class="user-info">

                            <strong id="nombreUsuario"></strong>

                            <span id="cargoUsuario"></span>

                            <button id="btnCerrarSesion">
                                Cerrar sesión
                            </button>

                        </div>

                    </header>


                    <!-- BIENVENIDA -->

                    <div class="welcome">

                        <h1 id="saludoUsuario"></h1>

                        <p id="descripcionVista">
                            Bienvenido a la plataforma de gestión
                            de Acme School.
                        </p>

                    </div>


                    <!-- TARJETAS PRINCIPALES -->

                    <div class="cards" id="tarjetasInicio">

                        <div class="card">

                            <h3>Gestión de usuarios</h3>

                            <p>
                                Administra los usuarios registrados
                                en nuestra plataforma.
                            </p>

                        </div>


                        <div class="card">

                            <h3>Gestión de exámenes</h3>

                            <p>
                                Crea, actualiza y administra los
                                exámenes de Acme School.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        `;


        // MOSTRAR INFORMACION DEL USUARIO

        this.shadowRoot.querySelector("#nombreUsuario").textContent = nombre;

        this.shadowRoot.querySelector("#cargoUsuario").textContent = cargo;

        this.shadowRoot.querySelector("#saludoUsuario").textContent =
            "¡Bienvenido, " + nombre + "!";


        // CERRAR SESION

        const botonCerrarSesion =
            this.shadowRoot.querySelector("#btnCerrarSesion");

        botonCerrarSesion.addEventListener("click", () => {

            // Enviamos un evento para cerrar la sesión
            this.dispatchEvent(new CustomEvent("logout-request", {

                bubbles: true,
                composed: true

            }));

        });


        // NAVEGACION DEL MENU

        // Seleccionamos los enlaces del menú
        const enlacesMenu = this.shadowRoot.querySelectorAll(".menu a");

        // Seleccionamos los elementos que vamos a modificar
        const titulo = this.shadowRoot.querySelector("#saludoUsuario");

        const descripcion =
            this.shadowRoot.querySelector("#descripcionVista");

        const tarjetas =
            this.shadowRoot.querySelector("#tarjetasInicio");


        // Recorremos los enlaces del menú
        enlacesMenu.forEach(enlace => {

            // Escuchamos los clics
            enlace.addEventListener("click", (event) => {

                event.preventDefault();

                // Obtenemos la sección seleccionada
                const seccion = enlace.dataset.seccion;


                // Quitamos la selección anterior
                enlacesMenu.forEach(item => {

                    item.classList.remove("activo");

                });


                // Marcamos la opción seleccionada
                enlace.classList.add("activo");


                // COMPROBAMOS LA SECCION

                if (seccion === "inicio") {

                    titulo.textContent =
                        "¡Bienvenido, " + nombre + "!";

                    descripcion.textContent =
                        "Bienvenido a la plataforma de gestión de Acme School.";

                    tarjetas.style.display = "grid";

                }

                else if (seccion === "usuarios") {

                    titulo.textContent =
                        "Gestión de usuarios";

                    descripcion.textContent =
                        "Aquí podrás administrar los usuarios de Acme School.";

                    tarjetas.style.display = "none";

                }

                else if (seccion === "examenes") {

                    titulo.textContent =
                        "Gestión de exámenes";

                    descripcion.textContent =
                        "Aquí podrás crear y administrar los exámenes.";

                    tarjetas.style.display = "none";

                }

            });

        });

    }

}


// REGISTRAMOS NUESTRO COMPONENTE

customElements.define("app-dashboard", AppDashboard);