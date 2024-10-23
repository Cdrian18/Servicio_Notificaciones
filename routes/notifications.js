const express = require('express');
const sendNotification = require('../services/notificationService');
const Notificacion = require('../models/notification')

const router = express.Router();

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
router.get('/', async (req, res) => {
  try {
    // Consultar todas las notificaciones desde la base de datos
    const notificaciones = await Notificacion.find({});
    // Devolver las notificaciones al cliente
    res.status(200).send(notificaciones);
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
