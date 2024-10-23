const twilio = require('twilio');
const nodemailer = require('nodemailer');
const Notification = require('../models/notification');

// Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const number = process.env.NUMBER;

// Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotification = async (tipo, mensaje, destinatario) => {
  // Crear una nueva notificación (si estás usando Mongo)
  const notification = new Notification({
    recipient: destinatario,
    channels: [tipo],
    message: mensaje,
    status: 'pendiente',
  });

  try {
    // Guardar notificación pendiente (si estás usando Mongo)
    await notification.save();

    if (tipo === 'sms') {
      // Enviar SMS con Twilio
      const message = await client.messages.create({
        body: mensaje,
        from: number,
        to: destinatario,
      });
      notification.status = 'enviado'; // Actualizar estado a 'enviado'
      await notification.save(); // Guardar el estado actualizado
      return { message: 'SMS enviado', sid: message.sid };
    } else if (tipo === 'email') {
      // Enviar email con Nodemailer
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: 'Notificación',
        text: mensaje,
      };

      const info = await transporter.sendMail(mailOptions);
      notification.status = 'enviado'; // Actualizar estado a 'enviado'
      await notification.save(); // Guardar el estado actualizado
      return { message: 'Correo enviado', info };
    } else {
      return { error: 'Tipo no soportado' };
    }
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    notification.status = 'fallido'; // Actualizar estado a 'fallido' en caso de error
    await notification.save(); // Guardar el estado fallido
    return { error: 'Error al enviar notificación' };
  }
};

module.exports = sendNotification;
