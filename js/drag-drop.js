export const uiDrag = {
    init: (selectorContenedor, selectorElemento) => {
        const contenedores = document.querySelectorAll(selectorContenedor);
        const elementos = document.querySelectorAll(selectorElemento);

        // Configurar los elementos como arrastrables
        elementos.forEach(elemento => {
            elemento.setAttribute('draggable', 'true');
            elemento.style.backgroundColor = 'white'; // Color inicial
            elemento.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', e.target.id); // Guardar el ID del elemento arrastrado
            });
        });

        // Funciones de los contenedores para manejar los eventos de arrastre
        contenedores.forEach(contenedor => {
            contenedor.addEventListener('dragover', (e) => {
                e.preventDefault(); // Permitir soltar
                contenedor.classList.add('drag-over'); // Estilo opcional al arrastrar
            });

            contenedor.addEventListener('dragleave', () => {
                contenedor.classList.remove('drag-over'); // Eliminar estilo al salir
            });

            contenedor.addEventListener('drop', (e) => {
                e.preventDefault(); // Necesario para que el evento funcione
                const idElemento = e.dataTransfer.getData('text'); // Obtener el ID del elemento
                const elemento = document.getElementById(idElemento); // Buscar el elemento arrastrado

                // Verificar que el palo de la carta coincida con el del contenedor
                const paloElemento = elemento.id.charAt(0); // Primer carácter es el palo
                const paloContenedor = contenedor.dataset.palo; // Ver si el contenedor tiene un palo asignado

                // Si el contenedor no tiene palo asignado, asignamos el palo de la primera carta
                if (!paloContenedor) {
                    contenedor.dataset.palo = paloElemento;
                }

                // Verificar que el palo coincida
                if (paloContenedor && paloContenedor !== paloElemento) {
                    alert('Solo puedes añadir cartas del mismo palo.');
                    return;
                }

                // Obtener las cartas dentro del contenedor para verificar la secuencia
                const cartasContenedor = Array.from(contenedor.children);
                const numerosContenedor = cartasContenedor.map(carta => parseInt(carta.id.slice(1))); // Extraemos los números de las cartas

                // Verificar secuencia: la carta debe ser el siguiente número consecutivo
                const maxNumero = Math.max(...numerosContenedor);
                const numeroCarta = parseInt(elemento.id.slice(1)); // Obtener el número de la carta

                if (numerosContenedor.length > 0 && numeroCarta !== maxNumero + 1) {
                    alert('Las cartas deben estar en secuencia numérica.');
                    return;
                }

                // Agregar la carta al contenedor
                contenedor.classList.remove('drag-over');
                contenedor.appendChild(elemento);
            });
        });
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => uiDrag.init('.contenedor', '.elemento'));
