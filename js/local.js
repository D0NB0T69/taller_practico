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
        let tiempoTranscurrido = 0;
        let temporizador;
        let pares;

        iniciarJuego();
        
        function iniciarJuego() {
            
            // limpia los campos 
            cartas = [];
            tablero.innerHTML = "";
            intentos = 0;
            cartasSeleccionadas = [];
            cartasEmparejadas = 0;
            tiempoTranscurrido = 0;
            
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
                    
                } else {
                    // Si las cartas no son iguales, volver a ocultarlas después de un segundo
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
        
        botonReiniciar.onclick = iniciarJuego;
        
        nivelSelect.onchange = iniciarJuego;