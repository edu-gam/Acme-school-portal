
class ExamPlayer extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.intervalo = null;
        this.segundosRestantes = 0;
        this.finalizado = false;
    }

    connectedCallback() {

        const examen = this.examen;
        const estudiante = this.estudiante;

        if (!examen || !estudiante ||
            !Array.isArray(examen.preguntas) ||
            examen.preguntas.length === 0) {

            this.shadowRoot.innerHTML = `
                <p>No hay preguntas disponibles para este examen.</p>
                <button id="volver">Volver</button>
            `;

            this.shadowRoot.querySelector("#volver")
                .addEventListener("click", () => {
                    this.volverAlPortal();
                });

            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: Arial, sans-serif;
                }

                .exam-page {
                    min-height: 100vh;
                    padding: 30px;
                    background: #f4f7fc;
                }

                .exam-header {
                    background: #174ea6;
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                }

                .exam-header p {
                    color: #dbeafe;
                    margin: 8px 0;
                }

                .timer {
                    display: inline-block;
                    padding: 12px 20px;
                    margin-top: 12px;
                    background: white;
                    color: #174ea6;
                    border-radius: 8px;
                    font-size: 25px;
                    font-weight: bold;
                }

                .urgente {
                    color: #dc2626;
                }

                .question-card {
                    background: white;
                    padding: 22px;
                    margin-bottom: 18px;
                    border-radius: 10px;
                }

                .question-card h3 {
                    color: #174ea6;
                    margin-bottom: 18px;
                }

                .answer {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    background: #f8fafc;
                    border-radius: 7px;
                    cursor: pointer;
                }

                .answer input {
                    width: 18px;
                    height: 18px;
                    accent-color: #1769e0;
                }

                .finish-button, button {
                    padding: 13px 22px;
                    background: #1769e0;
                    color: white;
                    border: none;
                    border-radius: 7px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .resultado {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 25px;
                    background: #f4f7fc;
                    text-align: center;
                    font-family: Arial, sans-serif;
                }

                .resultado-card {
                    max-width: 500px;
                    width: 100%;
                    padding: 35px;
                    background: white;
                    border-radius: 14px;
                }

                .porcentaje {
                    font-size: 55px;
                    font-weight: bold;
                    color: #174ea6;
                    margin: 20px;
                }

                .aprobado {
                    color: #15803d;
                }

                .no-aprobado {
                    color: #dc2626;
                }
            </style>

            <div class="exam-page">

                <div class="exam-header">
                    <h1 id="titulo"></h1>
                    <p id="estudiante"></p>
                    <p id="total"></p>
                    <p id="aprobacion"></p>
                    <div id="reloj" class="timer">00:00</div>
                </div>

                <div id="preguntas"></div>

                <button class="finish-button" id="terminar">
                    Terminar examen
                </button>

            </div>
        `;

        this.shadowRoot.querySelector("#titulo").textContent =
            examen.titulo;

        this.shadowRoot.querySelector("#estudiante").textContent =
            "Estudiante: " + estudiante.nombreCompleto;

        this.shadowRoot.querySelector("#total").textContent =
            "Total de preguntas: " + examen.preguntas.length;

        this.shadowRoot.querySelector("#aprobacion").textContent =
            "Porcentaje para aprobar: " + examen.aprobacion + "%";

        const contenedor =
            this.shadowRoot.querySelector("#preguntas");

        examen.preguntas.forEach((pregunta, indice) => {

            const tarjeta = document.createElement("div");
            tarjeta.className = "question-card";

            const titulo = document.createElement("h3");
            titulo.textContent =
                "Pregunta " + (indice + 1) + ": " + pregunta.enunciado;

            tarjeta.appendChild(titulo);

            pregunta.respuestas.forEach((respuesta, indiceRespuesta) => {

                const etiqueta = document.createElement("label");
                etiqueta.className = "answer";

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "pregunta-" + indice;
                radio.value = indiceRespuesta;

                const texto = document.createElement("span");
                texto.textContent = respuesta.texto;

                etiqueta.appendChild(radio);
                etiqueta.appendChild(texto);

                tarjeta.appendChild(etiqueta);

            });

            contenedor.appendChild(tarjeta);
        });

        this.shadowRoot.querySelector("#terminar")
            .addEventListener("click", () => {
                this.finalizarExamen(false);
            });

        this.segundosRestantes = Number(examen.tiempo) * 60;

        this.actualizarReloj();

        this.intervalo = setInterval(() => {

            this.segundosRestantes--;

            this.actualizarReloj();

            if (this.segundosRestantes <= 0) {
                this.finalizarExamen(true);
            }

        }, 1000);
    }

    actualizarReloj() {

        const reloj = this.shadowRoot.querySelector("#reloj");

        if (!reloj) return;

        const minutos =
            Math.floor(this.segundosRestantes / 60);

        const segundos =
            this.segundosRestantes % 60;

        reloj.textContent =
            String(minutos).padStart(2, "0") + ":" +
            String(segundos).padStart(2, "0");

        if (this.segundosRestantes <= 60) {
            reloj.classList.add("urgente");
        }
    }

    finalizarExamen(automatico) {

        if (this.finalizado) return;

        this.finalizado = true;

        clearInterval(this.intervalo);

        const examen = this.examen;
        const estudiante = this.estudiante;

        let correctas = 0;

        const detalle = [];

        examen.preguntas.forEach((pregunta, indice) => {

            const seleccionada = this.shadowRoot.querySelector(
                `input[name="pregunta-${indice}"]:checked`
            );

            const indiceRespuesta = seleccionada
                ? Number(seleccionada.value)
                : -1;

            const respuesta = indiceRespuesta >= 0
                ? pregunta.respuestas[indiceRespuesta]
                : null;

            const correcta = respuesta !== null &&
                respuesta.correcta === true;

            if (correcta) correctas++;

            detalle.push({
                pregunta: pregunta.enunciado,
                respuestaSeleccionada: respuesta
                    ? respuesta.texto
                    : "Sin responder",
                correcta
            });
        });

        const total = examen.preguntas.length;

        const porcentaje = Math.round((correctas / total) * 100);

        const aprobado =
            porcentaje >= Number(examen.aprobacion);

        // Guardar los resultados
        const resultados = JSON.parse(
            localStorage.getItem("acme_resultados") || "[]"
        );

        resultados.push({
            identificacion: estudiante.identificacion,
            nombreCompleto: estudiante.nombreCompleto,
            codigoExamen: examen.codigo,
            tituloExamen: examen.titulo,
            respuestasCorrectas: correctas,
            totalPreguntas: total,
            porcentaje,
            aprobado,
            fecha: new Date().toISOString(),
            respuestas: detalle
        });

        localStorage.setItem(
            "acme_resultados",
            JSON.stringify(resultados)
        );

        this.mostrarResultados(
            correctas,
            total,
            porcentaje,
            aprobado,
            automatico
        );
    }

    mostrarResultados(correctas, total, porcentaje, aprobado, automatico) {

        this.shadowRoot.innerHTML = `
            <style>
                .resultado {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 25px;
                    background: #f4f7fc;
                    text-align: center;
                    font-family: Arial, sans-serif;
                }

                .resultado-card {
                    width: 100%;
                    max-width: 500px;
                    padding: 35px;
                    background: white;
                    border-radius: 14px;
                }

                .porcentaje {
                    font-size: 55px;
                    color: #174ea6;
                    font-weight: bold;
                    margin: 20px;
                }

                .aprobado { color: #15803d; }
                .no-aprobado { color: #dc2626; }

                button {
                    margin-top: 20px;
                    padding: 13px 22px;
                    color: white;
                    background: #1769e0;
                    border: none;
                    border-radius: 7px;
                    cursor: pointer;
                }
            </style>

            <div class="resultado">
                <div class="resultado-card">

                    <h1 id="estado"></h1>

                    <div class="porcentaje" id="porcentaje"></div>

                    <p id="respuestas"></p>

                    <p id="tiempo"></p>

                    <button id="volver">
                        Volver a los exámenes
                    </button>

                </div>
            </div>
        `;

        const estado = this.shadowRoot.querySelector("#estado");

        estado.textContent = aprobado
            ? "¡Examen aprobado!"
            : "Examen no aprobado";

        estado.className = aprobado
            ? "aprobado"
            : "no-aprobado";

        this.shadowRoot.querySelector("#porcentaje")
            .textContent = porcentaje + "%";

        this.shadowRoot.querySelector("#respuestas")
            .textContent =
                "Respuestas correctas: " + correctas + " de " + total;

        this.shadowRoot.querySelector("#tiempo")
            .textContent = automatico
                ? "El tiempo del examen ha finalizado."
                : "Has terminado el examen.";

        this.shadowRoot.querySelector("#volver")
            .addEventListener("click", () => {
                this.volverAlPortal();
            });
    }

    volverAlPortal() {

        clearInterval(this.intervalo);

        this.dispatchEvent(new CustomEvent("back-to-portal", {
            bubbles: true,
            composed: true
        }));
    }

    disconnectedCallback() {
        clearInterval(this.intervalo);
    }
}

if (!customElements.get("exam-player")) {
    customElements.define("exam-player", ExamPlayer);
}
