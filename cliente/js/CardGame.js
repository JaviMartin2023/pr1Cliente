class CardGame {
    constructor(areaElementosSelector, contenedorSelector, palos, colores) {
        this.areaElementos = document.querySelector(areaElementosSelector);
        this.contenedores = document.querySelectorAll(contenedorSelector);
        this.palos = palos;
        this.colores = colores;
        this.cartasOriginales = {}; // Almacenamos el estado original de las cartas
    }

    async inicializar() {
        await this.cargarEstado(); // Cargar el estado inicial
        this.crearCartas();
        this.agregarEventosContenedores();
        this.registrarEventoReinicio(); // Registra el evento de reinicio
    }

    // Guardar el estado original de las cartas en sus contenedores
    guardarEstadoOriginal() {
        this.cartasOriginales = {}; // Reiniciamos el objeto de cartas originales
        this.contenedores.forEach(contenedor => {
            const cartas = Array.from(contenedor.children).map(carta => carta.id);
            this.cartasOriginales[contenedor.id] = cartas;
        });
    }

    reiniciarJuego() {
        // Mover todas las cartas a la baraja (areaElementos)
        this.contenedores.forEach(contenedor => {
            while (contenedor.firstChild) {
                this.areaElementos.appendChild(contenedor.firstChild); // Mueve las cartas a la baraja
            }
        });

        // Volver a agregar los eventos de arrastre
        this.agregarEventosArrastre();
    }

    registrarEventoReinicio() {
        const botonReinicio = document.getElementById('reiniciar');
        if (botonReinicio) {
            botonReinicio.addEventListener('click', () => {
                this.reiniciarJuego();
            });
        }
    }

    crearCartas() {
        this.palos.forEach((palo, i) => {
            for (let num = 1; num <= 12; num++) {
                const carta = this.crearCarta(palo, num, this.colores[i]);
                this.areaElementos.appendChild(carta);
            }
        });
    }

    crearCarta(palo, numero, color) {
        const carta = document.createElement('div');
        carta.classList.add('elemento', color);
        carta.setAttribute('draggable', 'true');
        carta.id = `${palo}${numero}`;

        // Números en las esquinas
        const numeroTop = document.createElement('div');
        numeroTop.classList.add('numero', 'top');
        numeroTop.textContent = numero;

        const numeroBottom = document.createElement('div');
        numeroBottom.classList.add('numero', 'bottom');
        numeroBottom.textContent = numero;

        // Palo en el centro
        const simbolo = document.createElement('div');
        simbolo.classList.add('palo');
        simbolo.textContent = palo;

        // Agregar elementos a la carta
        carta.appendChild(numeroTop);
        carta.appendChild(numeroBottom);
        carta.appendChild(simbolo);

        // Agregar el evento de arrastre
        carta.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', e.target.id);
        });

        return carta;
    }

    async guardarEstado() {
        const estadoActual = {
            contenedores: {}
        };
    
        this.contenedores.forEach(contenedor => {
            const id = contenedor.id;
            const cartas = Array.from(contenedor.children).map(carta => carta.id);
            estadoActual.contenedores[id] = cartas;
        });
    
        try {
            await fetch('http://localhost:3000/api/estado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(estadoActual)
            });
        } catch (error) {
            console.error('Error al guardar el estado:', error);
        }
    }

    agregarEventosContenedores() {
        this.contenedores.forEach(contenedor => {
            contenedor.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            contenedor.addEventListener('drop', async (e) => {
                e.preventDefault();
                const idCarta = e.dataTransfer.getData('text');
                const carta = document.getElementById(idCarta);
                const cartaDestino = contenedor.lastChild;

                // Comprobar que la carta arrastrada sea del mismo palo y consecutiva
                if (cartaDestino) {
                    const paloDestino = cartaDestino.id.charAt(0);
                    const numDestino = parseInt(cartaDestino.id.substring(1));

                    const paloArrastrada = carta.id.charAt(0);
                    const numArrastrada = parseInt(carta.id.substring(1));

                    if (paloDestino === paloArrastrada && numArrastrada === numDestino + 1) {
                        contenedor.appendChild(carta);
                    } else {
                        // Mostrar mensaje de error si no cumple las reglas
                        this.mostrarError("Las cartas deben ser del mismo palo y consecutivas.");
                        return;
                    }
                } else {
                    contenedor.appendChild(carta);
                }

                // Guardar el nuevo estado en el servidor
                await this.guardarEstado();
            });
        });
    }

    mostrarError(mensaje) {
        const errorElement = document.getElementById('error');
        if (errorElement) {
            errorElement.textContent = mensaje;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 3000);
        }
    }

    // Volver a agregar los eventos de arrastre después de reiniciar
    agregarEventosArrastre() {
        const cartas = document.querySelectorAll('.elemento');
        cartas.forEach(carta => {
            carta.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', e.target.id);
            });
        });
    }

    async cargarEstado() {
        try {
            const respuesta = await fetch('http://localhost:3000/api/estado');
            const datos = await respuesta.json();

            // Reconstruir el estado del juego
            Object.entries(datos.contenedores).forEach(([id, cartas]) => {
                const contenedor = document.getElementById(id);
                cartas.forEach(cartaId => {
                    const carta = document.getElementById(cartaId);
                    if (carta) contenedor.appendChild(carta);
                });
            });

            // Guardar las cartas originales
            this.guardarEstadoOriginal();

        } catch (error) {
            console.error('Error al cargar el estado:', error);
        }
    }
}

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    const palos = ['♥', '♦', '♣', '♠'];
    const colores = ['red', 'red', 'black', 'black'];
    const juego = new CardGame('#areaElementos', '.contenedor', palos, colores);
    juego.inicializar();
});
