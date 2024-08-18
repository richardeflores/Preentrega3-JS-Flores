document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculadora-form');
    const resultadoDiv = document.getElementById('resultado');
    const buscarBtn = document.getElementById('buscar-btn');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        // Obtén los valores de los campos del formulario
        const datos = obtenerDatos();

        // Verificar si los datos no son válidos
        if (!sonDatosValidos(datos)) {
            alert('Datos ingresados no son válidos. Inténtelo de nuevo.');
            return;
        }

        const { identificacion, sexo, edad, peso, creatinina, esNegro } = datos;
        const factorRacial = (esNegro === 'si') ? 1.21 : 1;
        const depuracionCreatinina = calcularDepuracionCreatininaPorSexo(sexo, edad, peso, creatinina, factorRacial);
        const valorReferencia = obtenerValorReferenciaPorEdad(edad);

        // Verifica si la depuración creatinina supera el valor de referencia
        if (depuracionCreatinina < valorReferencia) {
            Swal.fire({
                title: "Debe consultar con el médico",
                text: "Los valores estan bajo el rango de referencia",
                icon: "warning",
                timer: 5000,
                showConfirmButton:false,
            });
        }

        // Obtener nuevo ID de paciente y guardar resultado en sessionStorage
        const idPaciente = datos.identificacion;
        const resultado = {
            id: idPaciente,
            sexo,
            edad,
            peso,
            creatinina,
            depuracionCreatinina: depuracionCreatinina.toFixed(2),
            valorReferencia
        };
        sessionStorage.setItem(idPaciente, JSON.stringify(resultado));

        // Muestra el resultado en el div, incluyendo el ID del paciente
        resultadoDiv.innerHTML = `
            <h3>ID de Paciente: ${idPaciente}</h3>
            <p>Su Tasa de Filtración Glomerular estimada es: ${depuracionCreatinina.toFixed(2)} ml/min</p>
            <p>Valor de referencia para su grupo de edad: ${valorReferencia} ml/min</p>
        `;

        // Mostrar formulario para buscar por ID de paciente
        document.getElementById('form-id-paciente').style.display = 'block';
    });

    buscarBtn.addEventListener('click', function() {
        const idPaciente = document.getElementById('idPaciente').value;
        const resultado = sessionStorage.getItem(idPaciente);

        const resultadoPacienteDiv = document.getElementById('resultado-paciente');
        if (resultado) {
            const datos = JSON.parse(resultado);
            resultadoPacienteDiv.innerHTML = `
                <h3>Resultado para ID de Paciente: ${datos.id}</h3>
                <p>ID: ${datos.id}</p>
                <p>Sexo: ${datos.sexo}</p>
                <p>Edad: ${datos.edad}</p>
                <p>Peso: ${datos.peso} kg</p>
                <p>Creatinina sérica: ${datos.creatinina} mg/dL</p>
                <p>Indice de filtracion glomerular: ${datos.depuracionCreatinina} ml/min</p>
                <p>Valor de referencia: ${datos.valorReferencia} ml/min</p>
            `;
        } else {
            resultadoPacienteDiv.innerHTML = `<p>No se encontró ningún resultado para el ID de paciente ingresado.</p>`;
        }
    });

    function obtenerDatos() {
        return {
            identificacion: document.getElementById('identificacion').value,
            sexo: document.getElementById('sexo').value,
            edad: parseFloat(document.getElementById('edad').value),
            peso: parseFloat(document.getElementById('peso').value),
            creatinina: parseFloat(document.getElementById('creatinina').value),
            esNegro: document.getElementById('esNegro').value
        };
    }

    function sonDatosValidos(datos) {
        // Aquí puedes añadir validaciones adicionales si es necesario
        return datos.edad > 0 && datos.peso > 0 && datos.creatinina > 0;
    }

    function calcularDepuracionCreatininaPorSexo(sexo, edad, peso, creatinina, factorRacial) {
        let depuracion;
        if (sexo === 'hombre') {
            depuracion = ((140 - edad) * peso) / (72 * creatinina);
        } else if (sexo === 'mujer') {
            depuracion = ((140 - edad) * peso) / (72 * creatinina) * 0.85;
        }
        return depuracion * factorRacial;
    }

    function obtenerValorReferenciaPorEdad(edad) {
        switch (true) {
            case (edad >= 20 && edad <= 29):
                return 116;
            case (edad >= 30 && edad <= 39):
                return 107;
            case (edad >= 40 && edad <= 49):
                return 99;
            case (edad >= 50 && edad <= 59):
                return 93;
            case (edad >= 60 && edad <= 69):
                return 85;
            default:
                return 75;
        }
    }
});
