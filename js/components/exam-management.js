import {
    obtenerExamenes,
    guardarExamenes
} from "../storage.js";

// Creamos nuestro componente de exámenes
class ExamManagement extends HTMLElement {

    constructor() {
        super();

        // Creamos el Shadow DOM
        this.attachShadow({ mode: "open" });
        
        this.codigoEditando = null;
    }

    connectedCallback() {

        // Construimos la interfaz
        this.shadowRoot.innerHTML = `

            <style>

                :host {
                    display: block;
                    width: 100%;
                }

                .exam-container {
                    width: 100%;
                    padding: 25px;
                    background-color: white;
                    border-radius: 12px;
                }

                h2, h3 {
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
                    margin-bottom: 30px;
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

                input, textarea {
                    padding: 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 7px;
                    font-size: 14px;
                    font-family: Arial, sans-serif;
                }

                textarea {
                    resize: vertical;
                    min-height: 90px;
                }

                input:focus, textarea:focus {
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

                .formulario button {
                    width: auto;
                    min-width: 180px;
                    justify-self: start;
                    align-self: start;
                    padding: 12px 24px;
                }

                .boton-eliminar {
                    background-color: #dc2626;
                    margin-left: 8px;
                }

                .boton-eliminar:hover {
                    background-color: #b91c1c;
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

                @media (max-width: 600px) {

                    .formulario {
                        grid-template-columns: 1fr;
                    }

                    .exam-container {
                        padding: 15px;
                    }

                }

            </style>

            <div class="exam-container">

                <h2>Gestión de exámenes</h2>

                <p>
                    Crea y administra los exámenes de Acme School.
                </p>

                <h3>Registrar nuevo examen</h3>

                <form class="formulario" id="formularioExamen">

                    <div class="campo">

                        <label for="codigo">Código del examen</label>

                        <input
                            type="text"
                            id="codigo"
                            placeholder="Ej: EX001"
                            required
                        >

                    </div>

                    <div class="campo">

                        <label for="titulo">Título</label>

                        <input
                            type="text"
                            id="titulo"
                            placeholder="Nombre del examen"
                            required
                        >

                    </div>

                    <div class="campo">

                        <label for="tiempo">Tiempo (minutos)</label>

                        <input
                            type="number"
                            id="tiempo"
                            min="1"
                            placeholder="Ej: 30"
                            required
                        >

                    </div>

                    <div class="campo">

                        <label for="aprobacion">
                            Porcentaje de aprobación
                        </label>

                        <input
                            type="number"
                            id="aprobacion"
                            min="0"
                            max="100"
                            placeholder="Ej: 70"
                            required
                        >

                    </div>

                    <div class="campo">

                        <label for="descripcion">
                            Descripción del examen
                        </label>

                        <textarea
                            id="descripcion"
                            placeholder="Describe el contenido del examen"
                            required
                        ></textarea>

                    </div>

                    <button type="submit">
                        Registrar examen
                    </button>

                </form>

                <p id="mensajeExamen" role="status" aria-live="polite"></p>

                <h3>Exámenes registrados</h3>

                <div class="tabla-container">

                    <table>

                        <thead>

                            <tr>
                                <th>Código</th>
                                <th>Título</th>
                                <th>Tiempo</th>
                                <th>Aprobación</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>

                        </thead>

                        <tbody id="listaExamenes">

                            <tr>
                                <td colspan="6" class="mensaje-vacio">
                                    Todavía no hay exámenes registrados.
                                </td>
                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        `;

        // Mostramos los exámenes registrados
        this.mostrarExamenes();


        // Seleccionamos el formulario
        const formulario =
            this.shadowRoot.querySelector("#formularioExamen");


        // Escuchamos cuando se envía el formulario
        formulario.addEventListener("submit", (event) => {

            // Evitamos que la página se recargue
            event.preventDefault();

            // Obtenemos los datos del formulario
            const codigo = this.shadowRoot
                .querySelector("#codigo").value.trim().toUpperCase();

            const titulo = this.shadowRoot
                .querySelector("#titulo").value.trim();

            const tiempo = Number(
                this.shadowRoot.querySelector("#tiempo").value
            );

            const aprobacion = Number(
                this.shadowRoot.querySelector("#aprobacion").value
            );

            const descripcion = this.shadowRoot
                .querySelector("#descripcion").value.trim();


            // Obtenemos los exámenes actuales
            const examenes = obtenerExamenes();



            // Seleccionamos el espacio de mensajes
            const mensaje =
                this.shadowRoot.querySelector("#mensajeExamen");

            // Comprobamos si el código ya existe en otro examen
            const codigoExistente = examenes.some(examen => {

                const esOtroExamen =
                    examen.codigo !== this.codigoEditando;

                return esOtroExamen &&
                    examen.codigo.toUpperCase() === codigo;

            });

            // Validamos si el código está duplicado
            if (codigoExistente) {

                mensaje.textContent =
                    "Ya existe un examen con ese código.";

                mensaje.style.color = "#dc2626";

                return;
            }

            // Validamos el tiempo y el porcentaje
            if (tiempo <= 0 || aprobacion < 0 || aprobacion > 100) {

                mensaje.textContent =
                    "Revisa el tiempo y el porcentaje de aprobación.";

                mensaje.style.color = "#dc2626";

                return;
            }

            // Comprobamos si estamos editando
            const estabaEditando = this.codigoEditando !== null;

            if (estabaEditando) {

                // Buscamos el examen original
                const indiceExamen = examenes.findIndex(examen =>
                    examen.codigo === this.codigoEditando
                );

                if (indiceExamen === -1) {

                    mensaje.textContent =
                        "No se encontró el examen que deseas editar.";

                    mensaje.style.color = "#dc2626";

                    return;
                }

                // Conservamos las preguntas existentes
                const preguntasActuales =
                    examenes[indiceExamen].preguntas || [];

                // Actualizamos los datos del examen
                examenes[indiceExamen] = {
                    codigo,
                    titulo,
                    tiempo,
                    aprobacion,
                    descripcion,
                    preguntas: preguntasActuales
                };

            } else {

                // Creamos un examen nuevo
                const nuevoExamen = {
                    codigo,
                    titulo,
                    tiempo,
                    aprobacion,
                    descripcion,
                    preguntas: []
                };

                examenes.push(nuevoExamen);

            }

            // Guardamos los exámenes
            guardarExamenes(examenes);

            // Actualizamos la tabla
            this.mostrarExamenes();

            // Limpiamos el formulario
            formulario.reset();

            // Reiniciamos el modo de edición
            this.codigoEditando = null;

            // Restauramos el botón
            const boton = this.shadowRoot.querySelector(
                "#formularioExamen button[type='submit']"
            );

            boton.textContent = "Registrar examen";

            // Mostramos el mensaje correspondiente
            if (estabaEditando) {

                mensaje.textContent =
                    "¡Examen actualizado correctamente!";

            } else {

                mensaje.textContent =
                    "¡Examen registrado correctamente!";

            }

            mensaje.style.color = "#15803d";

            console.log(
                estabaEditando
                    ? "Examen actualizado:"
                    : "Nuevo examen registrado:",
                titulo
            );

        });
    }

    // Función para mostrar los exámenes registrados
    mostrarExamenes() {

        // Obtenemos los exámenes guardados
        const examenes = obtenerExamenes();

        // Seleccionamos la tabla
        const listaExamenes =
            this.shadowRoot.querySelector("#listaExamenes");

        // Limpiamos el contenido anterior
        listaExamenes.replaceChildren();


        // Comprobamos si existen exámenes
        if (examenes.length === 0) {

        const fila = document.createElement("tr");

        const celda = document.createElement("td");

        celda.textContent = "No hay exámenes registrados";

        celda.colSpan = 6;

        fila.appendChild(celda);

        listaExamenes.appendChild(fila);

        return;

    }

    // Recorremos los exámenes
    examenes.forEach(examen => {

        // Creamos una nueva fila
        const fila = document.createElement("tr");

        // Datos del examen
        const datos = [
            examen.codigo,
            examen.titulo,
            examen.tiempo + " minutos",
            examen.aprobacion + "%",
            examen.descripcion
        ];


        // Creamos las celdas
        datos.forEach(dato => {

            const celda = document.createElement("td");

            celda.textContent = dato;

            fila.appendChild(celda);

        });


        // Celda de acciones
        const acciones = document.createElement("td");

        // Botón Editar
        const botonEditar = document.createElement("button");

        botonEditar.textContent = "Editar";

        botonEditar.type = "button";

        botonEditar.addEventListener("click", () => {

            this.editarExamen(examen.codigo);

        });

        acciones.appendChild(botonEditar);


        // Botón Eliminar
        const botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";

        botonEliminar.type = "button";

        botonEliminar.className = "boton-eliminar";

        botonEliminar.addEventListener("click", () => {

            this.eliminarExamen(examen.codigo);

        });

        acciones.appendChild(botonEliminar);

        // Agregamos la celda
        fila.appendChild(acciones);

        // Agregamos la fila a la tabla
        listaExamenes.appendChild(fila);

        }); // Cerramos forEach

    } // Cerramos mostrarExamenes()

    // Función para editar un examen
    editarExamen(codigo)   
    {

        const examenes = obtenerExamenes();

        const examen = examenes.find(examen =>
            examen.codigo === codigo
        );

        if (!examen) {
            return;
        }

        this.codigoEditando = codigo;

        this.shadowRoot.querySelector("#codigo").value =
            examen.codigo;

        this.shadowRoot.querySelector("#titulo").value =
            examen.titulo;

        this.shadowRoot.querySelector("#tiempo").value =
            examen.tiempo;

        this.shadowRoot.querySelector("#aprobacion").value =
            examen.aprobacion;

        this.shadowRoot.querySelector("#descripcion").value =
            examen.descripcion;

        const boton = this.shadowRoot.querySelector(
            "#formularioExamen button[type='submit']"
        );

        boton.textContent = "Guardar cambios";

        const mensaje =
            this.shadowRoot.querySelector("#mensajeExamen");

        mensaje.textContent = "Editando: " + examen.titulo;

        mensaje.style.color = "#1769e0";

    }

    // Función para eliminar un examen
    eliminarExamen(codigo) 
    {

        const examenes = obtenerExamenes();

        const examen = examenes.find(examen =>
            examen.codigo === codigo
        );

        if (!examen) {
            return;
        }

        const confirmar = confirm(
            "¿Deseas eliminar el examen " + examen.titulo + "?"
        );

        if (!confirmar) {
            return;
        }

        const examenesActualizados = examenes.filter(examen =>
            examen.codigo !== codigo
        );

        guardarExamenes(examenesActualizados);

        this.mostrarExamenes();

        const mensaje =
            this.shadowRoot.querySelector("#mensajeExamen");

        mensaje.textContent = "Examen eliminado correctamente.";

        mensaje.style.color = "#15803d";

    }

}

// Registramos el componente una sola vez
if (!customElements.get("exam-management")) {

    customElements.define("exam-management", ExamManagement);

}
