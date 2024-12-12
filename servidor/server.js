const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../cliente')));

// Almacenamiento en memoria
let estadoJuego = {
    contenedores: {
        contenedor1: [{ id: '♥1', palo: '♥', numero: 1, color: 'red' }],
        contenedor2: [],
        contenedor3: [],
        contenedor4: []
    }
};


// Endpoint para obtener el estado actual del juego
// Rutas de la API
app.get('/api/estado', (req, res) => {
    res.json(estadoJuego);
});

app.post('/api/estado', (req, res) => {
    estadoJuego = req.body;
    res.status(200).json({ message: 'Estado guardado correctamente.' });
});

// Ruta para servir la aplicación cliente
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../cliente', 'index.html'));
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
