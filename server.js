const express = require('express');
require('dotenv').config(); // Variables de entorno

const app = express();
app.use(express.json()); // Parsear JSON

// Conectar a la base de datos (si estás usando Mongo en el futuro)
const connectDB = require('./config/bd');
connectDB();

// Rutas
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// Servidor escuchando en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
