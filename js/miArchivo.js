document.addEventListener("DOMContentLoaded", function() {
    /* Obtenemos los elementos del DOM */
    const notasForm = document.getElementById("notasForm");
    const resultadoElement = document.getElementById("resultado");
    const numAlumnosInput = document.getElementById("numAlumnos");
    const btnIngresar = document.querySelector("#notasForm button");
    const listaEstudiantesAnteriores = document.getElementById("estudiantesAnteriores");
    const listaMejoresEstudiantes = document.getElementById("mejoresEstudiantes");

    /* Cargamos los estudiantes anteriores desde el localStorage y los mostramos */
    const estudiantesAnteriores = JSON.parse(localStorage.getItem("estudiantes")) || [];
    mostrarEstudiantesAnteriores(estudiantesAnteriores);

    /* Cargamos estudiantes desde el JSON al inicio y los mostramos */
    fetch("usuarios.json")
    .then(response => response.json())
    .then(estudiantesDelJSON => {
        mostrarMejoresEstudiantes(estudiantesDelJSON);
    })
    .catch(error => {
        console.error('Error al cargar estudiantes del JSON:', error);
    });
    
    /* Manejamos el evento de envio del formulario */
    notasForm.addEventListener("submit", function(event) {
        event.preventDefault();

        /* Cargamos nuevamente los estudiantes del json */
        fetch("usuarios.json")
            .then(response => response.json())
            .then(students => {
                const numAlumnos = parseInt(numAlumnosInput.value);

                if (!isNaN(numAlumnos) && numAlumnos > 0) {
                    /* Ocultar el campo de entrada de numero de alumnos y el boton */
                    numAlumnosInput.style.display = "none";
                    btnIngresar.style.display = "none";

                    /* Creamos entradas para cada estudiante y agregarlas al container */
                    const notasInputsContainer = document.createElement("div");
                    notasInputsContainer.className = "mb-3";

                    for (let i = 0; i < numAlumnos; i++) {
                        const nombreApellidoInput = document.createElement("input");
                        nombreApellidoInput.type = "text";
                        nombreApellidoInput.id = `nombreApellido${i + 1}`;
                        nombreApellidoInput.className = "form-control mb-2";
                        nombreApellidoInput.placeholder = `Nombre y Apellido del estudiante ${i + 1}`;
                        nombreApellidoInput.required = true;

                        const notaInput = document.createElement("input");
                        notaInput.type = "text";
                        notaInput.id = `nota${i + 1}`;
                        notaInput.className = "form-control mb-2";
                        notaInput.placeholder = `Nota del estudiante ${i + 1}`;
                        notaInput.maxLength = 4;
                        notaInput.pattern = "[0-9]+([\\.,][0-9]+)?";
                        notaInput.required = true;

                        notasInputsContainer.appendChild(nombreApellidoInput);
                        notasInputsContainer.appendChild(notaInput);
                    }

                    /* Agregamos el container al formulario */
                    notasForm.appendChild(notasInputsContainer);

                    /* Creamos el boton de calculo */
                    const calcularBtn = document.createElement("button");
                    calcularBtn.type = "button";
                    calcularBtn.id = "calcularBtn";
                    calcularBtn.className = "btn btn-outline-primary btn-lg";
                    calcularBtn.textContent = "Calcular Nota Final";
                    notasForm.appendChild(calcularBtn);

                    /* Manejamos el evento de clic en el boton de calculo */
                    calcularBtn.addEventListener("click", function() {
                        let totalNotas = 0;
                        let notasValidas = true;
                        const estudiantesActuales = [];
                        const fechaCalculo = new Date().toLocaleDateString();

                        for (let i = 0; i < numAlumnos; i++) {
                            const nombreApellidoEstudianteInput = document.getElementById(`nombreApellido${i + 1}`);
                            const notaAlumnoInput = document.getElementById(`nota${i + 1}`);
                            const notaAlumno = parseFloat(notaAlumnoInput.value.replace(",", "."));

                            notasValidas = notasValidas && validarNota(notaAlumno);

                            totalNotas += notaAlumno;
                            
                            const [nombre, apellido] = nombreApellidoEstudianteInput.value.split(" ");
                            estudiantesActuales.push({
                                nombre,
                                apellido,
                                nota: notaAlumno,
                                fecha: fechaCalculo
                            });
                        }

                        if (notasValidas) {
                            const promedio = totalNotas / numAlumnos;
                            resultadoElement.textContent = `La nota final promedio de los ${numAlumnos} estudiantes es: ${promedio.toFixed(2)}`;
                            actualizarListaEstudiantes(estudiantesActuales);
                            guardarEstudiantesEnLocalStorage(estudiantesAnteriores.concat(estudiantesActuales));
                        } else {
                            resultadoElement.textContent = "Las notas deben estar entre 0 y 10. Por favor, ingrese las notas nuevamente.";
                        }
                    });
                } else {
                    resultadoElement.textContent = "Por favor, ingrese un número válido de estudiantes.";
                }
            })
            .catch(error => {
                console.error('Error al cargar datos:', error);
            });
    });

    const reiniciarBtn = document.createElement("button");
    reiniciarBtn.type = "button";
    reiniciarBtn.id = "reiniciarBtn";
    reiniciarBtn.className = "btn btn-outline-secondary btn-lg mt-3 mb-3";
    reiniciarBtn.textContent = "Reiniciar";
    notasForm.appendChild(reiniciarBtn);

    reiniciarBtn.addEventListener("click", function() {
        numAlumnosInput.style.display = "block";
        btnIngresar.style.display = "block";
        notasForm.removeChild(notasForm.lastElementChild);
        notasForm.removeChild(notasForm.lastElementChild);
        resultadoElement.textContent = "";
    });

    /* Funcion para validar si la nota esta dentro del rango permitido */
    function validarNota(nota) {
        return nota >= 0 && nota <= 10;
    }

    /* Funcion para mostrar estudiantes anteriores en la lista que les corresponde */
    function mostrarEstudiantesAnteriores(estudiantes) {
        estudiantes.forEach((estudiante, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.textContent = `Estudiante ${index + 1}: ${estudiante.nombre} ${estudiante.apellido} - Nota: ${estudiante.nota} - Fecha: ${estudiante.fecha}`;
            listaEstudiantesAnteriores.appendChild(listItem);
        });
    }

    /* Funcion para mostrar los mejores estudiantes del Json en la lista que les corresponde */
    function mostrarMejoresEstudiantes(mejoresEstudiantes) {
        listaMejoresEstudiantes.innerHTML = ""; 
    
        mejoresEstudiantes.forEach((estudiante, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.textContent = `Estudiante ${index + 1}: ${estudiante.nombre} ${estudiante.apellido} - Nota: ${estudiante.nota}`;
            listaMejoresEstudiantes.appendChild(listItem);
        });
    }

    /* Funcion para actualizar la lista de los estudiantes anteriores */
    function actualizarListaEstudiantes(estudiantes) {
        listaEstudiantesAnteriores.innerHTML = "";
        mostrarEstudiantesAnteriores(estudiantes);
    }

    /* Funcion para guardar los estudiantes en el localstorage */
    function guardarEstudiantesEnLocalStorage(estudiantes) {
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    }
});
