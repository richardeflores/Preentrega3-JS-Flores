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

        const { sexo, edad, peso, creatinina, esNegro } = datos;
        const factorRacial = (esNegro === 'si') ? 1.21 : 1;
        const depuracionCreatinina = calcularDepuracionCreatininaPorSexo(sexo, edad, peso, creatinina, factorRacial);

        // Obtener nuevo ID de paciente y guardar resultado en sessionStorage
        const nuevoId = obtenerNuevoId();
        const idPaciente = nuevoId;
        const resultado = {
            id: idPaciente,
            sexo,
            edad,
            peso,
            creatinina,
            depuracionCreatinina: depuracionCreatinina.toFixed(2),
            valorReferencia: sexo === 'hombre' ? '90-120 ml/min' : '80-120 ml/min'
        };
        sessionStorage.setItem(idPaciente, JSON.stringify(resultado));

        // Muestra el resultado en el div, incluyendo el ID del paciente
        resultadoDiv.innerHTML = `
            <h3>ID de Paciente: ${idPaciente}</h3>
            <p>Su depuración de creatinina estimada es: ${depuracionCreatinina.toFixed(2)} ml/min</p>
            <p>${sexo === 'hombre' ? 'Valor normal para hombres: 90-120 ml/min' : 'Valor normal para mujeres: 80-120 ml/min'}</p>
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
                <p>Sexo: ${datos.sexo}</p>
                <p>Edad: ${datos.edad}</p>
                <p>Peso: ${datos.peso} kg</p>
                <p>Creatinina sérica: ${datos.creatinina} mg/dL</p>
                <p>Depuración de creatinina: ${datos.depuracionCreatinina} ml/min</p>
                <p>Valor de referencia: ${datos.valorReferencia}</p>
            `;
        } else {
            resultadoPacienteDiv.innerHTML = `<p>No se encontró ningún resultado para el ID de paciente ingresado.</p>`;
        }
    });

    function obtenerNuevoId() {
        let ultimoId = sessionStorage.getItem('ultimoId');
        if (ultimoId === null) {
            ultimoId = 0;
        } else {
            ultimoId = parseInt(ultimoId);
        }
        const nuevoId = ultimoId + 1;
        sessionStorage.setItem('ultimoId', nuevoId);
        return nuevoId;
    }

    function obtenerDatos() {
        return {
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
});