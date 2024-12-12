import { uiDrag } from './drag-drop.js';

document.addEventListener('DOMContentLoaded', () => {
    const areaElementos = document.getElementById('areaElementos');
    const palos = ['♥', '♦', '♣', '♠'];
    const colores = ['red', 'red', 'black', 'black'];

    // Crear las cartas dinámicamente
    palos.forEach((palo, i) => {
        for (let num = 1; num <= 12; num++) {
            const carta = document.createElement('div');
            carta.classList.add('elemento', colores[i]);
            carta.setAttribute('draggable', 'true');
            carta.id = `${palo}${num}`;

            // Números en las esquinas
            const numeroTop = document.createElement('div');
            numeroTop.classList.add('numero', 'top');
            numeroTop.textContent = num;

            const numeroBottom = document.createElement('div');
            numeroBottom.classList.add('numero', 'bottom');
            numeroBottom.textContent = num;

            // Palo en el centro
            const simbolo = document.createElement('div');
            simbolo.classList.add('palo');
            simbolo.textContent = palo;

            // Agregar elementos a la carta
            carta.appendChild(numeroTop);
            carta.appendChild(numeroBottom);
            carta.appendChild(simbolo);

            // Añadir la carta al área de elementos
            areaElementos.appendChild(carta);
        }
    });

    // Inicializar funcionalidad de Drag & Drop
    uiDrag.init('.contenedor', '.elemento');
});
