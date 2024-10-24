const express = require('express');
const sendNotification = require('../services/notificationService');
const Notificacion = require('../models/notification');

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Notificacion:
 *       type: object
 *       required:
 *         - tipo
 *         - mensaje
 *         - destinatario
 *       properties:
 *         tipo:
 *           type: string
 *           description: Tipo de notificación (email, SMS, etc.)
 *         mensaje:
 *           type: string
 *           description: El contenido de la notificación
 *         destinatario:
 *           type: string
 *           description: Destinatario de la notificación
 */

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Enviar una nueva notificación
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notificacion'
 *     responses:
 *       200:
 *         description: Notificación enviada con éxito
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error en el servidor
 */

// Ruta para enviar notificaciones
router.post('/send', async (req, res) => {
  const { tipo, mensaje, destinatario } = req.body;

  // Validar los campos
  if (!tipo || !mensaje || !destinatario) {
    return res.status(400).send({ error: 'Faltan datos obligatorios' });
  }

  // Llamar al servicio de notificaciones
  const response = await sendNotification(tipo, mensaje, destinatario);

  if (response.error) {
    return res.status(500).send({ error: response.error });
  }

  res.status(200).send(response);
});

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Obtener todas las notificaciones
 *     tags: [Notificaciones]
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 *       500:
 *         description: Error al obtener las notificaciones
 */

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, recipient,channels,status , startDate, endDate} = req.query;
    const skip = (page - 1) * limit;

    // Crear un objeto para almacenar los filtros
    let filters = {};

    // Si se pasan parámetros de filtrado, agregarlos a la consulta
    if (recipient) {
      filters.recipient =  `+${req.query.recipient}`;;
    }
    // Filtrar por rango de fechas
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.$gte = new Date(startDate); // Desde la fecha de inicio
      }
      if (endDate) {
        filters.createdAt.$lte = new Date(endDate); // Hasta la fecha de fin
      }
    }
    if (channels) {
      // Si 'channels' se pasa como una lista separada por comas, dividirlo en un array
      filters.channels = { $in: channels.split(',') }; // Filtrar por uno o más canales
    }

    if (status) {
      filters.status = status; // Filtrar por estado
    }

    console.log('Filtros aplicados:', filters);
    // Consultar notificaciones con filtros y paginación
    const notificaciones = await Notificacion.find(filters)
      .skip(skip)
      .limit(parseInt(limit));
      console.log('Resultados de la consulta:', notificaciones); 

    const total = await Notificacion.countDocuments(filters);

    // Devolver las notificaciones al cliente
    res.status(200).send({
      total,
      page,
      pages: Math.ceil(total / limit), // Total de páginas
      results: notificaciones,
    });
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error); // Log completo del error
    res.status(500).send({ error: 'Error al obtener las notificaciones' });
  }
});

// Ruta para obtener una notificación por ID
router.get('/:id', async (req, res) => {
  try {
    const notificacion = await Notificacion.findById(req.params.id);

    // Si no se encuentra la notificación, devolver un 404
    if (!notificacion) {
      return res.status(404).send({ error: 'Notificación no encontrada' });
    }

    // Devolver la notificación encontrada
    res.status(200).send(notificacion);
  } catch (error) {
    console.error('Error al obtener la notificación:', error);
    res.status(500).send({ error: 'Error al obtener la notificación' });
  }
});

module.exports = router;
