const express = require('express');
const path = require('path');
const diff = require('diff');
const cors = require('cors')

const app = express();
const PORT = 4000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());

app.use(cors())

// Ruta para comparar textos
app.post('/compare', (req, res) => {
    const { text1, text2 } = req.body;

    if (!text1 || !text2) {
        return res.status(400).json({ error: 'Ambos textos son requeridos.' });
    }

    const differences = diff.diffChars(text1, text2);
    res.json({ differences });
});

app.listen(PORT,'0.0.0.0',() => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
