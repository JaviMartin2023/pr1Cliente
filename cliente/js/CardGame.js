// Archivo: CardGame.js

class CardGame {
    constructor(areaElementosSelector, contenedorSelector, palos, colores) {
        this.areaElementos = document.querySelector(areaElementosSelector);
        this.contenedores = document.querySelectorAll(contenedorSelector);
        this.palos = palos;
        this.colores = colores;
    }

    async inicializar() {
        await this.cargarEstado(); // Cargar el estado inicial
        this.crearCartas();
        this.agregarEventosContenedores();
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

        // Agregar eventos de drag and drop
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
                e.preventDefault(); // Permitir que sea un destino de drop
            });
    
            contenedor.addEventListener('drop', async (e) => {
                e.preventDefault();
    
                const idCarta = e.dataTransfer.getData('text');
                const carta = document.getElementById(idCarta);
    
                if (!carta) {
                    console.error('No se encontró la carta:', idCarta);
                    return;
                }
    
                // Validar si la carta puede ser soltada en este contenedor
                const cartaNumero = parseInt(idCarta.slice(1)); // Número de la carta
                const cartaPalo = idCarta[0]; // Palo de la carta
    
                const cartasEnContenedor = Array.from(contenedor.children);
                if (cartasEnContenedor.length > 0) {
                    // Obtener la última carta en el contenedor
                    const ultimaCartaId = cartasEnContenedor[cartasEnContenedor.length - 1].id;
                    const ultimaCartaNumero = parseInt(ultimaCartaId.slice(1));
                    const ultimaCartaPalo = ultimaCartaId[0];
    
                    // Validar palo y secuencia
                    if (cartaPalo !== ultimaCartaPalo) {
                        console.error('El palo no coincide:', cartaPalo, ultimaCartaPalo);
                        return;
                    }
                    if (cartaNumero !== ultimaCartaNumero + 1) {
                        console.error('La carta no sigue la secuencia:', cartaNumero, ultimaCartaNumero);
                        return;
                    }
                } else {
                    // Si el contenedor está vacío, solo permitir cartas con número 1
                    if (cartaNumero !== 1) {
                        console.error('Solo se puede iniciar con un As (1):', cartaNumero);
                        return;
                    }
                }
    
                // Si pasa todas las validaciones, añadir la carta al contenedor
                contenedor.appendChild(carta);
    
                // Guardar el nuevo estado en el servidor
                await this.guardarEstado();
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
