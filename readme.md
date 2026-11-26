# Acme School

## Descripción del proyecto

Acme School es una plataforma web desarrollada para la gestión y presentación de exámenes. El proyecto permite administrar usuarios, crear exámenes con sus respectivas preguntas y permitir que los estudiantes los presenten desde un portal público.

La idea principal es tener una plataforma sencilla y fácil de utilizar, donde tanto los administradores como los docentes puedan gestionar la información y los estudiantes puedan realizar sus evaluaciones.

## Objetivo

Desarrollar una aplicación web que permita organizar usuarios y exámenes, además de ofrecer un espacio para que los estudiantes puedan responder preguntas y conocer su resultado al finalizar la evaluación.

## Funcionalidades principales

- **Inicio de sesión:** permite ingresar a la plataforma con un correo y una contraseña.
- **Gestión de usuarios:** permite registrar, consultar, editar y eliminar usuarios.
- **Gestión de exámenes:** permite crear, consultar, editar y eliminar exámenes.
- **Gestión de preguntas:** permite agregar preguntas a cada examen, registrar diferentes respuestas y seleccionar cuál es la correcta.
- **Portal público:** permite consultar los exámenes disponibles sin iniciar sesión.
- **Presentación de exámenes:** permite ingresar los datos del estudiante y responder las preguntas.
- **Temporizador:** muestra el tiempo disponible para completar cada examen.
- **Resultados:** al finalizar, muestra el porcentaje obtenido y si el estudiante aprobó o no.

## Tecnologías utilizadas

- HTML5 para la estructura de la página.
- CSS3 para los estilos y el diseño visual.
- JavaScript para las funciones e interacciones.
- LocalStorage para guardar la información en el navegador.
- Web Components para organizar los diferentes módulos de la aplicación.

## Estructura del proyecto

```text
AcmeSchool/
│
├── index.html
├── README.md
│
├── css/
│   └── styles.css
│
└── js/
    ├── main.js
    ├── storage.js
    ├── auth.js
    │
    └── components/
        ├── login-form.js
        ├── app-dashboard.js
        ├── user-management.js
        ├── exam-management.js
        ├── question-management.js
        ├── public-exam-portal.js
        └── exam-player.js
```

## Cómo ejecutar el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Abrir el archivo `index.html` utilizando Live Server.
4. Ingresar con una de las cuentas de prueba para acceder al panel de administración.

## Cuentas de prueba

**Administrador**

- Correo: `admin@acmeschool.com`
- Contraseña: `Admin123!`

**Docente**

- Correo: `docente@acmeschool.com`
- Contraseña: `Docente123!`

## Cómo utilizar la plataforma

1. Iniciar sesión con una de las cuentas disponibles.
2. Desde el panel principal, ingresar a la gestión de usuarios o de exámenes.
3. Crear un examen indicando su código, título, tiempo, porcentaje de aprobación y descripción.
4. Ingresar a la sección de preguntas para agregar las preguntas y sus respuestas.
5. Volver a la pantalla de inicio e ingresar al portal público.
6. Seleccionar un examen, escribir los datos del estudiante y comenzar a responder.
7. Al finalizar, la plataforma mostrará el resultado de la evaluación.

## Almacenamiento de información

La aplicación utiliza LocalStorage para guardar los usuarios, los exámenes y los resultados directamente en el navegador. Esto permite conservar la información aunque se cierre o actualice la página en el mismo navegador.

La información no se comparte entre diferentes dispositivos o navegadores.

## Autor

Proyecto realizado como actividad académica para poner en práctica los conocimientos adquiridos en HTML, CSS y JavaScript.

**Nombre:** Eduardo

**Proyecto:** Acme School  
**Asignatura:** JavaScript