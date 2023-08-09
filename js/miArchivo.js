// Función para validar que una nota esté en el rango de 0 a 10
function validarNota(nota) {
    return nota >= 0 && nota <= 10;
}

// Función para poder guardar los datos en localstorage
function guardarDatos(estudiantes) {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
}

// Función para cargar los datos desde localstorage
function cargarDatos() {
    const data = localStorage.getItem("estudiantes");
    return data ? JSON.parse(data) : [];
}

// Función para calcular la nota final
function calcularNotaFinal() {
    // Pedimos el numero de estudiantes
    let numAlumnos = parseInt(prompt("Ingrese el numero de alumnos:"));

    let estudiantes = [];

    // Pedimos las notas de cada alumno y creamos los objetos correspondientes
    for (let i = 0; i < numAlumnos; i++) {
        let notaAlumno;

        do {
            notaAlumno = parseFloat(prompt(`Ingrese la nota del alumno ${i + 1}:`));
            
            if (!validarNota(notaAlumno)) {
                alert("La nota debe estar entre 0 y 10. Por favor, ingrese la nota nuevamente.");
            }
        } while (!validarNota(notaAlumno));

        // Creamos un objeto para el estudiante y lo añadimos al array
        estudiantes.push({ numero: i + 1, nota: notaAlumno });
    }

    // Guardamos los datos en localstorage
    guardarDatos(estudiantes);

    // Calculamos la suma de las notas finales
    let sumaNotasFinales = estudiantes.reduce((acumulador, { nota }) => acumulador + nota, 0);

    // Calculamos la nota promedio
    let promedio = sumaNotasFinales / numAlumnos;

    // Se muestra el resultado en el DOM
    document.getElementById("resultado").textContent = `La nota final promedio de los ${numAlumnos} alumnos es: ${promedio.toFixed(2)}`;
}

// Agregamos un evento al botón para calcular la nota final
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("calcularBtn").addEventListener("click", function() {
        // Reiniciar el contenido del elemento resultado
        document.getElementById("resultado").textContent = ""; // Por alguna razon no me elimina el resultado cuando vuelvo a presionar el boton para calcular un nuevo resultado, espero pueda revisar y ayudarme con eso tutor.
        console.log(resultado);
        // Calcular la nota final
        calcularNotaFinal();
    });
});


