// Variables del juego
let palabraSecreta = '';
let palabraOculta = [];
let letrasUsadas = [];
let errores = 0;
let maxErrores = 6;
let victorias = 0;
let derrotas = 0;
let partidaTerminada = false;

// Diccionario de palabras por categoría
const palabras = {
    animales: ['PERRO', 'GATO', 'ELEFANTE', 'LEON', 'TIGRE', 'JIRAFA', 'MONO', 'OSO', 'CABALLO', 'VACA'],
    frutas: ['MANZANA', 'PLATANO', 'NARANJA', 'FRESA', 'UVA', 'SANDIA', 'MELON', 'CEREZA', 'PINA', 'MANGO']
};

// Dibujos del ahorcado en ASCII
const dibujosAhorcado = [
    `
  +---+
  |   |
      |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

// Elementos del DOM
const elementoPalabraOculta = document.getElementById('palabra-oculta');
const elementoLetrasUsadas = document.getElementById('lista-letras');
const elementoAhorcado = document.getElementById('ahorcado');
const elementoTeclado = document.getElementById('teclado');
const elementoVictorias = document.getElementById('victorias');
const elementoDerrotas = document.getElementById('derrotas');
const selectorCategoria = document.getElementById('categoria');
const botonNuevaPartida = document.getElementById('btn-nueva-partida');
const listaHistorial = document.getElementById('lista-historial');
const botonVerHistorial = document.getElementById('btn-ver-historial');
const botonLimpiarHistorial = document.getElementById('btn-limpiar-historial');

// Inicializar el juego
function inicializarJuego() {
    // Obtener categoría seleccionada
    const categoria = selectorCategoria.value;
    
    // Seleccionar una palabra aleatoria de la categoría
    const indice = Math.floor(Math.random() * palabras[categoria].length);
    palabraSecreta = palabras[categoria][indice];
    
    // Inicializar variables
    palabraOculta = Array(palabraSecreta.length).fill('_');
    letrasUsadas = [];
    errores = 0;
    partidaTerminada = false;
    
    // Actualizar la interfaz
    actualizarPalabraOculta();
    actualizarLetrasUsadas();
    actualizarDibujoAhorcado();
    crearTeclado();
    
    // Cargar estadísticas
    cargarEstadisticas();
    
    // Eliminar mensajes anteriores
    const mensajes = document.querySelectorAll('.mensaje-ganador, .mensaje-perdedor');
    mensajes.forEach(mensaje => mensaje.remove());
}

// Actualizar la palabra oculta en la interfaz
function actualizarPalabraOculta() {
    elementoPalabraOculta.textContent = palabraOculta.join(' ');
}

// Actualizar las letras usadas en la interfaz
function actualizarLetrasUsadas() {
    elementoLetrasUsadas.textContent = letrasUsadas.join(' ');
}

// Actualizar el dibujo del ahorcado
function actualizarDibujoAhorcado() {
    elementoAhorcado.textContent = dibujosAhorcado[errores];
}

// Crear el teclado de letras
function crearTeclado() {
    elementoTeclado.innerHTML = '';
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let letra of letras) {
        const boton = document.createElement('button');
        boton.textContent = letra;
        boton.addEventListener('click', () => adivinarLetra(letra, boton));
        
        // Deshabilitar botones de letras ya usadas
        if (letrasUsadas.includes(letra)) {
            boton.disabled = true;
        }
        
        elementoTeclado.appendChild(boton);
    }
}

// Procesar cuando el jugador adivina una letra
function adivinarLetra(letra, boton) {
    if (partidaTerminada || letrasUsadas.includes(letra)) {
        return;
    }
    
    // Deshabilitar el botón
    boton.disabled = true;
    
    // Añadir la letra a las letras usadas
    letrasUsadas.push(letra);
    actualizarLetrasUsadas();
    
    // Verificar si la letra está en la palabra secreta
    if (palabraSecreta.includes(letra)) {
        // Actualizar la palabra oculta con la letra correcta
        for (let i = 0; i < palabraSecreta.length; i++) {
            if (palabraSecreta[i] === letra) {
                palabraOculta[i] = letra;
            }
        }
        actualizarPalabraOculta();
        
        // Verificar si ganó
        if (!palabraOculta.includes('_')) {
            terminarPartida(true);
        }
    } else {
        // Incrementar errores
        errores++;
        actualizarDibujoAhorcado();
        
        // Verificar si perdió
        if (errores >= maxErrores) {
            terminarPartida(false);
        }
    }
}

// Terminar la partida
function terminarPartida(ganada) {
    partidaTerminada = true;
    
    if (ganada) {
        victorias++;
        elementoVictorias.textContent = victorias;
        
        // Mostrar mensaje de victoria
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-ganador';
        mensaje.textContent = '¡Bien! Ganaste. La palabra era: ' + palabraSecreta;
        document.getElementById('zona-juego').appendChild(mensaje);
    } else {
        derrotas++;
        elementoDerrotas.textContent = derrotas;
        
        // Mostrar mensaje de derrota
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-perdedor';
        mensaje.textContent = 'Perdiste. La palabra era: ' + palabraSecreta;
        document.getElementById('zona-juego').appendChild(mensaje);
        
        // Mostrar la palabra completa
        elementoPalabraOculta.textContent = palabraSecreta.split('').join(' ');
    }
    
    // Deshabilitar todos los botones del teclado
    const botones = elementoTeclado.querySelectorAll('button');
    botones.forEach(boton => {
        boton.disabled = true;
    });
    
    // Guardar en el historial y estadísticas
    guardarEnHistorial(ganada);
    guardarEstadisticas();
}

// Guardar partida en el historial
function guardarEnHistorial(ganada) {
    const fecha = new Date().toLocaleString();
    const resultado = ganada ? 'Victoria' : 'Derrota';
    
    // Obtener historial existente o crear uno nuevo
    const historial = JSON.parse(localStorage.getItem('ahorcadoHistorial') || '[]');
    
    // Añadir nueva partida al historial
    historial.push({
        fecha: fecha,
        resultado: resultado,
        palabra: palabraSecreta,
        categoria: selectorCategoria.value,
        intentos: letrasUsadas.length,
        errores: errores
    });
    
    // Guardar en localStorage
    localStorage.setItem('ahorcadoHistorial', JSON.stringify(historial));
}

// Cargar historial desde localStorage
function cargarHistorial() {
    const historial = JSON.parse(localStorage.getItem('ahorcadoHistorial') || '[]');
    listaHistorial.innerHTML = '';
    
    // Ordenar por fecha (más recientes primero)
    historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    for (let partida of historial) {
        const elemento = document.createElement('li');
        elemento.textContent = `${partida.fecha} - ${partida.resultado} - Palabra: ${partida.palabra} (${partida.categoria}) - Intentos: ${partida.intentos} - Errores: ${partida.errores}`;
        listaHistorial.appendChild(elemento);
    }
}

// Guardar estadísticas en localStorage
function guardarEstadisticas() {
    localStorage.setItem('ahorcadoVictorias', victorias);
    localStorage.setItem('ahorcadoDerrotas', derrotas);
}

// Cargar estadísticas desde localStorage
function cargarEstadisticas() {
    victorias = parseInt(localStorage.getItem('ahorcadoVictorias') || '0');
    derrotas = parseInt(localStorage.getItem('ahorcadoDerrotas') || '0');
    elementoVictorias.textContent = victorias;
    elementoDerrotas.textContent = derrotas;
}

// Limpiar historial
function limpiarHistorial() {
    localStorage.removeItem('ahorcadoHistorial');
    listaHistorial.innerHTML = '';
}

// Event listeners
botonNuevaPartida.addEventListener('click', inicializarJuego);

botonVerHistorial.addEventListener('click', function() {
    cargarHistorial();
});

botonLimpiarHistorial.addEventListener('click', function() {
    limpiarHistorial();
});

// Iniciar el juego al cargar la página
window.addEventListener('load', function() {
    inicializarJuego();
});