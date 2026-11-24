class AppDashboard extends HTMLElement {

    constructor() {
        super();

        // Creamos el Shadow DOM
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        // Construimos el contenido del Dashboard
        this.shadowRoot.innerHTML = `

            <style>

                :host {
                    display: block;
                    width: 100%;
                }

                .dashboard {
                    width: 100%;
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 240px 1fr;
                    background-color: #f4f7fc;
                    border-radius: 0;
                    overflow: hidden;
                    font-family: Arial, sans-serif;
                }

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

                .content {
                    padding: 30px;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
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
                
                .user-info button {
                    margin-top: 10px;
                    padding: 9px 15px;
                    background-color: #ffffff;
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

                .welcome h1 {
                    color: #1e293b;
                    margin-bottom: 10px;
                }

                .welcome p {
                    color: #64748b;
                }

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
                    box-shadow: 0 3px 12px rgba(0,0,0,0.05);
                }

                .card h3 {
                    color: #174ea6;
                    margin-bottom: 12px;
                }

                .card p {
                    font-size: 14px;
                    line-height: 1.5;
                }

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

                    .cards {
                        grid-template-columns: 1fr;
                    }

                    .header {
                        gap: 15px;
                    }

                }

            </style>

            <div class="dashboard">

                <aside class="sidebar">

                    <h2>Acme School</h2>

                    <p>Plataforma educativa</p>

                    <nav class="menu">

                        <a href="#">Inicio</a>

                        <a href="#">Usuarios</a>

                        <a href="#">Exámenes</a>

                    </nav>

                </aside>

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

                    <div class="welcome">

                        <h1 id="saludoUsuario"></h1>

                        <p>
                            Bienvenido a la plataforma de gestión
                            de Acme School.
                        </p>

                    </div>

                    <div class="cards">

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

        // Obtenemos los datos del usuario
        const nombre = this.getAttribute("nombre");

        const cargo = this.getAttribute("cargo");

        // Mostramos los datos en el Dashboard
        this.shadowRoot.querySelector("#nombreUsuario").textContent = nombre;

        this.shadowRoot.querySelector("#cargoUsuario").textContent = cargo;

        this.shadowRoot.querySelector("#saludoUsuario").textContent =
            "¡Bienvenido, " + nombre + "!";

        const botonCerrarSesion =
            this.shadowRoot.querySelector("#btnCerrarSesion");

        botonCerrarSesion.addEventListener("click", () => {

            this.dispatchEvent(new CustomEvent("logout-request", {
                bubbles: true,
                composed: true
    }));

});

    }

}

customElements.define("app-dashboard", AppDashboard);