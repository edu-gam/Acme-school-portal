
import { iniciarSesion } from "../auth.js";

// Creamos nuestro componente LoginForm
class LoginForm extends HTMLElement {

    constructor() {
        super();

        // Creamos el Shadow DOM
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        // Construimos la interfaz del Login
        this.shadowRoot.innerHTML = `

            <style>

                .login-card {
                    background-color: white;
                    width: 100%;
                    max-width: 400px;
                    padding: 35px;
                    border-radius: 12px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                }

                h1 {
                    color: #1769e0;
                    text-align: center;
                    margin-bottom: 10px;
                }

                p {
                    color: #64748b;
                    text-align: center;
                    margin-bottom: 25px;
                }

                label {
                    display: block;
                    margin-bottom: 7px;
                    font-weight: bold;
                    color: #334155;
                }

                input {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 20px;
                    border: 1px solid #cbd5e1;
                    border-radius: 7px;
                    box-sizing: border-box;
                }

                button {
                    width: 100%;
                    padding: 13px;
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

                .public-button {
                    width: 100%;
                    margin-top: 12px;
                    padding: 12px;

                    background-color: white;
                    color: #1769e0;

                    border: 1px solid #1769e0;
                    border-radius: 7px;

                    cursor: pointer;
                    font-weight: bold;
                }

                .public-button:hover {
                    background-color: #eff6ff;
                }

                .mensaje {
                    text-align: center;
                    margin-top: 15px;
                    font-size: 14px;
                }

                .mensaje.error {
                    color: #dc2626;
                }

                .mensaje.exito {
                    color: #15803d;
                }

            </style>


            <div class="login-card">

                <h1>Acme School</h1>

                <p>Ingresa a tu cuenta para continuar</p>


                <!-- FORMULARIO DE LOGIN -->

                <form id="formularioLogin">

                    <label for="email">
                        Correo electrónico
                    </label>

                    <input
                        type="email"
                        id="email"
                        placeholder="Ingresa tu correo"
                        required
                    >

                    <label for="password">
                        Contraseña
                    </label>

                    <input
                        type="password"
                        id="password"
                        placeholder="Ingresa tu contraseña"
                        required
                    >

                    <button type="submit">
                        Iniciar sesión
                    </button>

                    <div
                        id="mensaje"
                        class="mensaje"
                        role="status"
                        aria-live="polite"
                    ></div>

                </form>


                <!-- ACCESO PUBLICO -->

                <button
                    type="button"
                    id="btnPortalPublico"
                    class="public-button"
                >
                    Realizar un examen
                </button>

            </div>

        `;


        // =====================================
        // EVENTO DE INICIO DE SESION
        // =====================================

        const formulario =
            this.shadowRoot.querySelector("#formularioLogin");

        formulario.addEventListener("submit", (event) => {

            // Evitamos que la página se recargue
            event.preventDefault();

            // Obtenemos los datos ingresados
            const email = this.shadowRoot
                .querySelector("#email")
                .value.trim().toLowerCase();

            const password = this.shadowRoot
                .querySelector("#password")
                .value;

            // Intentamos iniciar sesión
            const resultado = iniciarSesion(email, password);

            // Seleccionamos el espacio para mensajes
            const mensaje =
                this.shadowRoot.querySelector("#mensaje");


            // Comprobamos el resultado
            if (resultado.correcto) {

                mensaje.textContent =
                    "¡Bienvenido, " +
                    resultado.usuario.nombreCompleto + "!";

                mensaje.className = "mensaje exito";

                console.log("Inicio de sesión exitoso");


                // Enviamos el evento de login
                this.dispatchEvent(new CustomEvent("login-success", {

                    detail: resultado.usuario,

                    bubbles: true,

                    composed: true

                }));

            } else {

                mensaje.textContent =
                    "Correo o contraseña incorrectos.";

                mensaje.className = "mensaje error";

                console.log("Credenciales incorrectas");

            }

        });


        // =====================================
        // EVENTO DEL PORTAL PUBLICO
        // =====================================

        const botonPortalPublico =
            this.shadowRoot.querySelector("#btnPortalPublico");

        botonPortalPublico.addEventListener("click", () => {

            console.log("Solicitando acceso al portal público");

            // Enviamos el evento para abrir el portal
            this.dispatchEvent(new CustomEvent("public-exams-request", {

                bubbles: true,

                composed: true

            }));

        });

    }

}


// REGISTRAMOS EL COMPONENTE

if (!customElements.get("login-form")) {

    customElements.define("login-form", LoginForm);

}
