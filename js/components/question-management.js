
import {
    obtenerExamenes,
    guardarExamenes
} from "../storage.js";

class QuestionManagement extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        const codigo = this.getAttribute("codigo");
        const examenes = obtenerExamenes();

        const examen = examenes.find(item =>
            item.codigo === codigo
        );

        if (!examen) {
            this.shadowRoot.innerHTML =
                "<p>No se encontró el examen.</p>";
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                .question-container {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                }

                h2, h3 {
                    color: #174ea6;
                    margin-bottom: 18px;
                }

                p {
                    color: #64748b;
                }

                .campo {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 18px;
                }

                label {
                    color: #334155;
                    font-weight: bold;
                }

                textarea, input[type="text"] {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 7px;
                    box-sizing: border-box;
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
                    padding: 11px 17px;
                    background: #1769e0;
                    color: white;
                    border: none;
                    border-radius: 7px;
                    cursor: pointer;
                    font-weight: bold;
                    margin: 5px;
                }

                button:hover {
                    background: #1053b5;
                }

                .pregunta-card {
                    padding: 18px;
                    margin-top: 15px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 9px;
                }

                .respuesta-correcta {
                    color: #15803d;
                    font-weight: bold;
                }

                .boton-eliminar {
                    background: #dc2626;
                }

                .mensaje {
                    margin: 15px 0;
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
                            required
                        ></textarea>

                    </div>

                    <h3>Respuestas posibles</h3>

                    <p>Selecciona una única respuesta correcta.</p>

                    <div id="contenedorRespuestas"></div>

                    <button type="button" id="btnAgregarRespuesta">
                        Agregar respuesta
                    </button>

                    <button type="submit">
                        Guardar pregunta
                    </button>

                </form>

                <p id="mensajePregunta"
                   class="mensaje"
                   role="status"
                   aria-live="polite"></p>

                <h3>Preguntas registradas</h3>

                <div id="listaPreguntas"></div>

            </div>
        `;

        this.shadowRoot.querySelector("#tituloExamen").textContent =
            examen.titulo;

        this.shadowRoot.querySelector("#descripcionExamen").textContent =
            examen.descripcion;

        const contenedorRespuestas =
            this.shadowRoot.querySelector("#contenedorRespuestas");

        let numeroRespuestas = 0;

        // Agregar campos de respuesta
        const agregarCampoRespuesta = () => {

            const item = document.createElement("div");
            item.className = "respuesta-item";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "respuestaCorrecta";
            radio.required = true;

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Respuesta " + (numeroRespuestas + 1);
            input.required = true;

            item.appendChild(radio);
            item.appendChild(input);

            contenedorRespuestas.appendChild(item);

            numeroRespuestas++;
        };

        agregarCampoRespuesta();
        agregarCampoRespuesta();

        // Botón para agregar respuestas
        this.shadowRoot.querySelector("#btnAgregarRespuesta")
            .addEventListener("click", () => {
                agregarCampoRespuesta();
            });

        // Formulario para guardar preguntas
        const formulario =
            this.shadowRoot.querySelector("#formularioPregunta");

        formulario.addEventListener("submit", (event) => {

            event.preventDefault();

            const mensaje =
                this.shadowRoot.querySelector("#mensajePregunta");

            const enunciado =
                this.shadowRoot.querySelector("#textoPregunta").value.trim();

            const campos =
                this.shadowRoot.querySelectorAll(".respuesta-item");

            const respuestas = Array.from(campos).map(item => ({
                texto: item.querySelector('input[type="text"]').value.trim(),
                correcta: item.querySelector('input[type="radio"]').checked
            }));

            if (enunciado === "") {
                mensaje.textContent = "Escribe el enunciado.";
                mensaje.style.color = "#dc2626";
                return;
            }

            if (respuestas.length < 2 ||
                respuestas.some(respuesta => respuesta.texto === "")) {

                mensaje.textContent =
                    "Completa al menos dos respuestas.";

                mensaje.style.color = "#dc2626";
                return;
            }

            const correctas = respuestas.filter(
                respuesta => respuesta.correcta
            ).length;

            if (correctas !== 1) {

                mensaje.textContent =
                    "Debes seleccionar exactamente una respuesta correcta.";

                mensaje.style.color = "#dc2626";
                return;
            }

            // Volvemos a obtener la información actualizada
            const lista = obtenerExamenes();

            const indice = lista.findIndex(item =>
                item.codigo === codigo
            );

            if (indice === -1) {
                mensaje.textContent = "No se encontró el examen.";
                mensaje.style.color = "#dc2626";
                return;
            }

            if (!Array.isArray(lista[indice].preguntas)) {
                lista[indice].preguntas = [];
            }

            lista[indice].preguntas.push({
                enunciado,
                respuestas
            });

            guardarExamenes(lista);

            this.mostrarPreguntas();

            formulario.reset();

            contenedorRespuestas.replaceChildren();

            numeroRespuestas = 0;

            agregarCampoRespuesta();
            agregarCampoRespuesta();

            mensaje.textContent =
                "¡Pregunta registrada correctamente!";

            mensaje.style.color = "#15803d";

        });

        this.mostrarPreguntas();
    }

    // Mostrar preguntas
    mostrarPreguntas() {

        const codigo = this.getAttribute("codigo");
        const examenes = obtenerExamenes();

        const examen = examenes.find(item =>
            item.codigo === codigo
        );

        const lista =
            this.shadowRoot.querySelector("#listaPreguntas");

        lista.replaceChildren();

        if (!examen || !examen.preguntas ||
            examen.preguntas.length === 0) {

            lista.textContent =
                "Todavía no hay preguntas registradas.";

            return;
        }

        examen.preguntas.forEach((pregunta, indice) => {

            const tarjeta = document.createElement("div");
            tarjeta.className = "pregunta-card";

            const titulo = document.createElement("h4");

            titulo.textContent =
                "Pregunta " + (indice + 1) + ": " + pregunta.enunciado;

            tarjeta.appendChild(titulo);

            const ul = document.createElement("ul");

            pregunta.respuestas.forEach(respuesta => {

                const li = document.createElement("li");

                li.textContent =
                    (respuesta.correcta ? "✓ " : "• ") +
                    respuesta.texto;

                if (respuesta.correcta) {
                    li.className = "respuesta-correcta";
                }

                ul.appendChild(li);
            });

            tarjeta.appendChild(ul);

            const boton = document.createElement("button");

            boton.type = "button";
            boton.textContent = "Eliminar pregunta";
            boton.className = "boton-eliminar";

            boton.addEventListener("click", () => {
                this.eliminarPregunta(indice);
            });

            tarjeta.appendChild(boton);

            lista.appendChild(tarjeta);
        });
    }

    // Eliminar pregunta
    eliminarPregunta(indice) {

        const codigo = this.getAttribute("codigo");
        const examenes = obtenerExamenes();

        const indiceExamen = examenes.findIndex(item =>
            item.codigo === codigo
        );

        if (indiceExamen === -1) return;

        const preguntas = examenes[indiceExamen].preguntas || [];

        if (!preguntas[indice]) return;

        if (!confirm("¿Deseas eliminar esta pregunta?")) return;

        preguntas.splice(indice, 1);

        examenes[indiceExamen].preguntas = preguntas;

        guardarExamenes(examenes);

        this.mostrarPreguntas();

        const mensaje =
            this.shadowRoot.querySelector("#mensajePregunta");

        mensaje.textContent = "Pregunta eliminada correctamente.";
        mensaje.style.color = "#15803d";
    }
}

if (!customElements.get("question-management")) {
    customElements.define("question-management", QuestionManagement);
}


// Registramos el componente
if (!customElements.get("question-management")) {

    customElements.define(
        "question-management",
        QuestionManagement
    );

}
