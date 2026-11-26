
import { obtenerExamenes } from "../storage.js";

class PublicExamPortal extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: Arial, sans-serif;
                }

                .portal {
                    min-height: 100vh;
                    padding: 35px;
                    background: #f4f7fc;
                }

                .encabezado {
                    background: #174ea6;
                    color: white;
                    padding: 30px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                }

                .encabezado p {
                    color: #dbeafe;
                }

                .examenes {
                    display: grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }

                .examen-card, .form-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 3px 12px rgba(0,0,0,.05);
                }

                h2, h3 {
                    color: #174ea6;
                }

                p {
                    color: #64748b;
                    line-height: 1.5;
                }

                label {
                    display: block;
                    margin: 15px 0 7px;
                    color: #334155;
                    font-weight: bold;
                }

                input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 7px;
                    box-sizing: border-box;
                }

                button {
                    padding: 12px 18px;
                    background: #1769e0;
                    color: white;
                    border: none;
                    border-radius: 7px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 15px;
                }

                button:hover {
                    background: #1053b5;
                }

                .volver {
                    background: white;
                    color: #174ea6;
                    border: 1px solid #174ea6;
                    margin-bottom: 20px;
                }

                .mensaje {
                    margin-top: 15px;
                }

                @media (max-width: 600px) {
                    .portal {
                        padding: 15px;
                    }
                }
            </style>

            <div class="portal">

                <button class="volver" id="btnVolver">
                    Volver al inicio
                </button>

                <div class="encabezado">
                    <h1>Portal de exámenes</h1>
                    <p>
                        Selecciona el examen que deseas realizar.
                    </p>
                </div>

                <div id="contenidoPortal"></div>

            </div>
        `;

        this.shadowRoot.querySelector("#btnVolver")
            .addEventListener("click", () => {

                this.dispatchEvent(new CustomEvent("back-to-login", {
                    bubbles: true,
                    composed: true
                }));

            });

        this.mostrarExamenes();
    }

    mostrarExamenes() {

        const contenido =
            this.shadowRoot.querySelector("#contenidoPortal");

        contenido.replaceChildren();

        const examenes = obtenerExamenes();

        const disponibles = examenes.filter(examen =>
            Array.isArray(examen.preguntas) &&
            examen.preguntas.length > 0
        );

        if (disponibles.length === 0) {

            const mensaje = document.createElement("p");

            mensaje.textContent =
                "Actualmente no hay exámenes disponibles.";

            contenido.appendChild(mensaje);

            return;
        }

        const lista = document.createElement("div");
        lista.className = "examenes";

        disponibles.forEach(examen => {

            const tarjeta = document.createElement("div");
            tarjeta.className = "examen-card";

            const titulo = document.createElement("h3");
            titulo.textContent = examen.titulo;

            const tiempo = document.createElement("p");
            tiempo.textContent =
                "Tiempo: " + examen.tiempo + " minutos";

            const aprobacion = document.createElement("p");
            aprobacion.textContent =
                "Aprobación: " + examen.aprobacion + "%";

            const cantidad = document.createElement("p");
            cantidad.textContent =
                "Preguntas: " + examen.preguntas.length;

            const boton = document.createElement("button");
            boton.textContent = "Presentar examen";

            boton.addEventListener("click", () => {
                this.mostrarIdentificacion(examen);
            });

            tarjeta.appendChild(titulo);
            tarjeta.appendChild(tiempo);
            tarjeta.appendChild(aprobacion);
            tarjeta.appendChild(cantidad);
            tarjeta.appendChild(boton);

            lista.appendChild(tarjeta);
        });

        contenido.appendChild(lista);
    }

    mostrarIdentificacion(examen) {

        const contenido =
            this.shadowRoot.querySelector("#contenidoPortal");

        const tarjeta = document.createElement("div");
        tarjeta.className = "form-card";

        tarjeta.innerHTML = `
            <h2 id="tituloSeleccionado"></h2>

            <p>
                Ingresa tus datos antes de comenzar el examen.
            </p>

            <form id="formularioEstudiante">

                <label for="identificacionEstudiante">
                    Número de identificación
                </label>

                <input
                    type="text"
                    id="identificacionEstudiante"
                    required
                >

                <label for="nombreEstudiante">
                    Nombre completo
                </label>

                <input
                    type="text"
                    id="nombreEstudiante"
                    required
                >

                <button type="submit">
                    Comenzar examen
                </button>

                <button type="button" id="btnRegresar" class="volver">
                    Elegir otro examen
                </button>

            </form>

            <p id="mensajeEstudiante" class="mensaje"></p>
        `;

        contenido.replaceChildren(tarjeta);

        tarjeta.querySelector("#tituloSeleccionado").textContent =
            examen.titulo;

        tarjeta.querySelector("#btnRegresar")
            .addEventListener("click", () => {
                this.mostrarExamenes();
            });

        tarjeta.querySelector("#formularioEstudiante")
            .addEventListener("submit", (event) => {

                event.preventDefault();

                const identificacion =
                    tarjeta.querySelector(
                        "#identificacionEstudiante"
                    ).value.trim();

                const nombreCompleto =
                    tarjeta.querySelector("#nombreEstudiante")
                        .value.trim();

                if (!identificacion || !nombreCompleto) {
                    return;
                }

                const estudiante = {
                    identificacion,
                    nombreCompleto
                };

                this.dispatchEvent(new CustomEvent("student-ready", {

                    detail: {
                        examen: examen,
                        estudiante: estudiante
                    },

                    bubbles: true,
                    composed: true

                }));

            });
    }
}

if (!customElements.get("public-exam-portal")) {
    customElements.define("public-exam-portal", PublicExamPortal);
}
