document.addEventListener("DOMContentLoaded", function() {
    /* Obtener los elementos del formulario y del resultado */
    const notasForm = document.getElementById("notasForm");
    const resultadoElement = document.getElementById("resultado");

    notasForm.addEventListener("submit", function(event) {
        event.preventDefault();

        /* Numero de alumnos ingresados */
        const numAlumnosInput = document.getElementById("numAlumnos");
        const numAlumnos = parseInt(numAlumnosInput.value);

        /* Validacion del numero de alumnos */
        if (!isNaN(numAlumnos) && numAlumnos > 0) {
            /* Eliminar resultado anteriores */
            while (notasForm.firstChild) {
                notasForm.removeChild(notasForm.firstChild);
            }

            const notasInputsContainer = document.createElement("div");
            notasInputsContainer.className = "mb-3";
            notasForm.appendChild(notasInputsContainer);

            for (let i = 0; i < numAlumnos; i++) {
                const notaInput = document.createElement("input");
                /* Atributos y estilos para los campos de entrada */
                notaInput.type = "text";
                notaInput.id = `nota${i + 1}`;
                notaInput.className = "form-control mb-2";
                notaInput.placeholder = `Nota del alumno ${i + 1}`;
                notaInput.maxLength = 4;
                notaInput.pattern = "[0-9]+([\\.,][0-9]+)?";
                notaInput.required = true;

                notasInputsContainer.appendChild(notaInput);
            }

            /* Boton para calcular la nota final */
            const calcularBtn = document.createElement("button");
            calcularBtn.type = "button";
            calcularBtn.id = "calcularBtn";
            calcularBtn.className = "btn btn-outline-primary btn-lg";
            calcularBtn.textContent = "Calcular Nota Final";
            notasForm.appendChild(calcularBtn);

            calcularBtn.addEventListener("click", function() {
                let totalNotas = 0;
                let notasValidas = true;

                /* Validacion de la suma de las notas  */
                for (let i = 0; i < numAlumnos; i++) {
                    const notaAlumnoInput = document.getElementById(`nota${i + 1}`);
                    const notaAlumno = parseFloat(notaAlumnoInput.value.replace(",", "."));

                    notasValidas = notasValidas && validarNota(notaAlumno); // Uso del operador AND para notas válidas

                    totalNotas += notaAlumno;
                }

                /* Mostrar el resultado */
                if (notasValidas) {
                    const promedio = totalNotas / numAlumnos;
                    resultadoElement.textContent = `La nota final promedio de los ${numAlumnos} alumnos es: ${promedio.toFixed(2)}`;
                } else {
                    resultadoElement.textContent = "Las notas deben estar entre 0 y 10. Por favor, ingrese las notas nuevamente.";
                }
            });
        } else {
            resultadoElement.textContent = "Por favor, ingrese un número válido de alumnos.";
        }
    });

    /* Validacion de la nota */
    function validarNota(nota) {
        return nota >= 0 && nota <= 10;
    }
});
