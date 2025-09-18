 // cracion de constantes y capturamos con los ids del html
const tablero = document.getElementById("tablero");
const intentosSpan = document.getElementById("intentos");
const tiempoSpan = document.getElementById("tiempo");
const mejorTiempoSpan = document.getElementById("mejor-tiempo");
const mejorIntentosSpan = document.getElementById("mejor-intentos");
const botonReiniciar = document.getElementById("boton_reiniciar");
const nivelSelect = document.getElementById("nivel");
        
let cartas = [];
let cartasSeleccionadas = [];
let cartasEmparejadas = 0;
let intentos = 0;
let temporizador;
let pares;
let tiempo = 0;

iniciarJuego();
        
function iniciarJuego() {
                 
    // limpia los campos 
    cartas = [];
    tablero.innerHTML = "";
    intentos = 0;
    cartasSeleccionadas = [];
    cartasEmparejadas = 0;
    tiempoTranscurrido = 0;
    tiempo = 0;
    clearInterval(temporizador); // detener cronómetro de la anterior partida
    tiempoSpan.textContent = 0; // reiniciar visualmente
            
    // dificultad
    if (nivelSelect.value === "facil") {
        pares = 4; 
    } else {
    pares = 6; 
    }
            
    //array de cartas dependiendo del nivel de difultad
    for (let i = 1; i <= pares; i++) {
        cartas.push(i, i); // esto me permite que aparesca dos veces un numero, y que basicamente se cumpla la condicion de que existan parejas parejas 
    }
            
    // mezclaa cartas
    cartas.sort(() => Math.random() - 0.5);
            
    // creaa cartas en el tablero, recordar que la amplitud del array de cartas depende al nivel de dificultad
    for (let i = 0; i < cartas.length; i++) {
        const carta = document.createElement("div"); // crea un elemento div asignado a la constante carta
        carta.className = "carta"; //aqui basicamente asignamos una clase de css a la constante carta para que se aplique un estilo 
        carta.dataset.valor = cartas[i]; //
                
        // cuando el usuario haga clic en la carta llamara a otra funcion en este caso llamada seleccionarcarta
        carta.onclick = function() {
        seleccionarCarta(this); // el parametro this indica que va utlisar el elemento carta 
        };
                
        tablero.appendChild(carta);
    }

    iniciarCronometro(); //llama a la funcion para contabilizar el tiempo
    actualizarMejores(); //llama a la funcion para actualizar puntajes
    actualizarMejoresLocal();
}
        
// función para seleccionar una carta
function seleccionarCarta(carta) {
    // si la carta ya está revelada o ya hay dos cartas seleccionadas, no hacer nada
    if (carta.classList.contains("revelada") || cartasSeleccionadas.length === 2) {
        return;
    }
            
    // revelar la carta
    carta.textContent = carta.dataset.valor;
    carta.classList.add("revelada");
    cartasSeleccionadas.push(carta);
            
    // si hay dos cartas seleccionadas
    if (cartasSeleccionadas.length === 2) {
        intentos++;
        intentosSpan.textContent = intentos;
                
        const carta1 = cartasSeleccionadas[0];
        const carta2 = cartasSeleccionadas[1];
                
        // si las cartas son iguales
        if (carta1.dataset.valor === carta2.dataset.valor) {
            cartasSeleccionadas = [];
            cartasEmparejadas += 2;

            if (cartasEmparejadas === cartas.length) {
                detenerCronometro();
                guardarMejores();
                guardarMejoresLocal(); 
            }
                    
        } else {
            // Si las cartas no son iguales, vuelve a ocultarlas después de un segundo
            setTimeout(function() {
                carta1.classList.remove("revelada");
                carta2.classList.remove("revelada");
                cartasSeleccionadas = [];
                carta1.textContent = "";
                carta2.textContent = "";
            }, 1000);
        }
    }
}


// funcionalidad de tiempo
function iniciarCronometro() {
    tiempo = 0;
    tiempoSpan.textContent = tiempo; // empieza en 0 visualmente
    temporizador = setInterval(() => {
        tiempo++;
        let minutos = Math.floor(tiempo / 60);// la fucnionalidad math.floor hace un redondeo hacia abajo 
        let segundos = tiempo % 60;
        tiempoSpan.textContent = (minutos > 0 ? minutos + "m " : "") + segundos + "s";
    }, 1000); // el mil indica que cada 1 segundo se vuelve y ejecuta este bloauqe de codigo.
}

function detenerCronometro() {
    clearInterval(temporizador);
}

//funcionalidad de session storage
function guardarMejores() {
    // guardar mejor tiempo
    let mejorTiempoGuardado = sessionStorage.getItem("mejorTiempo");
    if (!mejorTiempoGuardado || tiempo < parseInt(mejorTiempoGuardado)) {
        sessionStorage.setItem("mejorTiempo", tiempo);
    }

    // Guardar mejor intentos
    let mejorIntentosGuardado = sessionStorage.getItem("mejorIntentos");
    if (!mejorIntentosGuardado || intentos < parseInt(mejorIntentosGuardado)) {
        sessionStorage.setItem("mejorIntentos", intentos);
    }

    actualizarMejores();
}
function actualizarMejores() {
    let mejorTiempo = sessionStorage.getItem("mejorTiempo");
    let mejorIntentos = sessionStorage.getItem("mejorIntentos");

    if (mejorTiempo) {
        let minutos = Math.floor(mejorTiempo / 60);
        let segundos = mejorTiempo % 60;
        mejorTiempoSpan.textContent = (minutos > 0 ? " | session : " + minutos + "m " : "") + segundos + "s";
    }

    if (mejorIntentos) {
        mejorIntentosSpan.textContent += " | session : " + mejorIntentos;
    }

}

//funcionalidad con local storage para la persistencia
function guardarMejoresLocal() {
    let mejorTiempoLocal = localStorage.getItem("mejorTiempo");
    if (!mejorTiempoLocal || tiempo < parseInt(mejorTiempoLocal)) {
        localStorage.setItem("mejorTiempo", tiempo);
    }

    let mejorIntentosLocal = localStorage.getItem("mejorIntentos");
    if (!mejorIntentosLocal || intentos < parseInt(mejorIntentosLocal)) {
        localStorage.setItem("mejorIntentos", intentos);
    }

    actualizarMejores();
}
function actualizarMejoresLocal(){
    let mejorTiempoLocal = localStorage.getItem("mejorTiempo");
    let mejorIntentosLocal = localStorage.getItem("mejorIntentos");

    if (mejorTiempoLocal) {
        mejorTiempoLocal = parseInt(mejorTiempoLocal); 
        let minutos = Math.floor(mejorTiempoLocal / 60);
        let segundos = mejorTiempoLocal % 60;
        mejorTiempoSpan.textContent += " | Local: " + (minutos > 0 ? minutos + "m " : "") + segundos + "s";
    }

    if (mejorIntentosLocal) {
        mejorIntentosLocal = parseInt(mejorIntentosLocal);
        mejorIntentosSpan.textContent += " | Local: " + mejorIntentosLocal;
    }
}
        
botonReiniciar.onclick = iniciarJuego;
        
nivelSelect.onchange = iniciarJuego;