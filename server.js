const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5997;

// Servir archivos estáticos desde la carpeta actual
app.use(express.static(__dirname));

// Ruta principal que sirve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});