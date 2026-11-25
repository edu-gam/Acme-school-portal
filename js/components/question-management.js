
import {
    obtenerExamenes,
    guardarExamenes
} from "../storage.js";

// Componente para gestionar las preguntas
class QuestionManagement extends HTMLElement {

    constructor() {
        super();

        // Creamos el Shadow DOM
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        // Obtenemos el código del examen seleccionado
        const codigo = this.getAttribute("codigo");

        // Consultamos los exámenes guardados
        const examenes = obtenerExamenes();

        // Buscamos el examen correspondiente
        const examen = examenes.find(examen =>
            examen.codigo === codigo
        );

        // Comprobamos si existe
        if (!examen) {

            this.shadowRoot.innerHTML = `
                <p>No se encontró el examen seleccionado.</p>
            `;

            return;
        }

        // Construimos la interfaz
        this.shadowRoot.innerHTML = `

            <style>

                :host {
                    display: block;
                    width: 100%;
                }

                .question-container {
                    background-color: white;
                    padding: 25px;
                    border-radius: 12px;
                }

                h2 {
                    color: #174ea6;
                    margin-bottom: 15px;
                }

                p {
                    color: #64748b;
                }

                .campo {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 20px;
                }

                label {
                    color: #334155;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                textarea,
                input[type="text"] {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 7px;
                    font-family: Arial, sans-serif;
                }

                #contenedorRespuestas {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .respuesta-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .respuesta-item input[type="radio"] {
                    width: 18px;
                    height: 18px;
                    accent-color: #1769e0;
                }

                .respuesta-item input[type="text"] {
                    flex: 1;
                }

                button {
                    padding: 11px 18px;
                    border: none;
                    border-radius: 7px;
                    background-color: #1769e0;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                }

            </style>

            <div class="question-container">

                <h2 id="tituloExamen"></h2>

                <p id="descripcionExamen"></p>

                <h3>Agregar nueva pregunta</h3>

                <form id="formularioPregunta">

                    <div class="campo">

                        <label for="textoPregunta">
                            Enunciado de la pregunta
                        </label>

                        <textarea
                            id="textoPregunta"
                            placeholder="Escribe aquí la pregunta"
                            required
                        ></textarea>

                    </div>

                    <h3>Respuestas posibles</h3>

                    <p>
                        Selecciona el círculo de la respuesta correcta.
                    </p>

                    <div id="contenedorRespuestas"></div>

                    <button type="button" id="btnAgregarRespuesta">
                        Agregar respuesta
                    </button>

                    <button type="submit">
                        Guardar pregunta
                    </button>

                </form>

                <p id="mensajePregunta" role="status" aria-live="polite"></p>

                <h3>Preguntas registradas</h3>

                <div id="listaPreguntas"></div>

            </div>

        `;

        // Mostramos los datos del examen
        this.shadowRoot.querySelector("#tituloExamen").textContent =
            examen.titulo;

        this.shadowRoot.querySelector("#descripcionExamen").textContent =
            examen.descripcion;

    }

}

// Registramos el componente
if (!customElements.get("question-management")) {

    customElements.define(
        "question-management",
        QuestionManagement
    );

}
