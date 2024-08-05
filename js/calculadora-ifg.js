document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculadora-form');
    const resultadoDiv = document.getElementById('resultado');

    // Cargar resultado almacenado en sessionStorage al cargar la página
    const storedResultado = sessionStorage.getItem('resultado');
    if (storedResultado) {
        resultadoDiv.innerHTML = 'El último resultado almacenado es: ' + JSON.parse(storedResultado).toFixed(2) + ' ml/min';
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        // Obtén los valores de los campos del formulario
        const datos = obtenerDatos();

        // Verificar si los datos no son válidos
        if (!sonDatosValidos(datos)) {
            alert('Datos ingresados no son válidos. Inténtelo de nuevo.');
            location.reload();
            return;
        }

        const { sexo, edad, peso, creatinina, esNegro } = datos;
        const factorRacial = (esNegro === 'si') ? 1.21 : 1;
        const depuracionCreatinina = calcularDepuracionCreatininaPorSexo(sexo, edad, peso, creatinina, factorRacial);

        // Muestra el resultado en el div
        resultadoDiv.innerHTML = 'Su depuración de creatinina estimada es: ' + depuracionCreatinina.toFixed(2) + ' ml/min';

        // Determinar valores de referencia
        let valoresReferencia;
        if (sexo === 'hombre') {
            valoresReferencia = 'Valor normal para hombres: 90-120 ml/min';
        } else if (sexo === 'mujer') {
            valoresReferencia = 'Valor normal para mujeres: 80-120 ml/min';
        }

        resultadoDiv.innerHTML += '<br>' + valoresReferencia;

        // Almacena el resultado en sessionStorage
        sessionStorage.setItem('resultado', JSON.stringify(depuracionCreatinina));

        // También puedes almacenar en localStorage si lo deseas
        localStorage.setItem('resultado', JSON.stringify(depuracionCreatinina));
    });

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