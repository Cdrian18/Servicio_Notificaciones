const express = require('express');
require('dotenv').config(); // Variables de entorno

const app = express();
app.use(express.json()); // Parsear JSON


const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definir la configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Notificaciones',
      version: '1.0.0',
      description: 'API para el envío y manejo de notificaciones',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`, // Ajusta el URL base de la API
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta donde están definidos tus endpoints (puede variar según tu estructura)
};

// Generar la documentación Swagger con swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Conectar a la base de datos (si estás usando Mongo en el futuro)
const connectDB = require('./config/bd');
connectDB();

// Rutas
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// Ruta de la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Servidor escuchando en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
