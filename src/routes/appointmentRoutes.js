const express = require('express');
const router = express.Router();
const { verifyToken, isDoctor } = require('../middlewares/auth');

// Aquí normalmente importarías el controlador
// const appointmentController = require('../controllers/appointmentController');

// Obtener todas las citas (con filtros opcionales)
router.get('/', verifyToken, (req, res) => {
  // appointmentController.getAppointments
  res.json({ message: 'Lista de citas' });
});

// Obtener una cita específica
router.get('/:id', verifyToken, (req, res) => {
  // appointmentController.getAppointmentById
  res.json({ message: `Detalles de la cita ${req.params.id}` });
});

// Crear una nueva cita
router.post('/', verifyToken, (req, res) => {
  // appointmentController.createAppointment
  res.json({ 
    message: 'Cita creada',
    appointment: req.body
  });
});

// Actualizar una cita
router.put('/:id', verifyToken, (req, res) => {
  // appointmentController.updateAppointment
  res.json({ 
    message: `Cita ${req.params.id} actualizada`,
    appointment: req.body
  });
});

// Cancelar una cita
router.patch('/:id/cancel', verifyToken, (req, res) => {
  // appointmentController.cancelAppointment
  res.json({ message: `Cita ${req.params.id} cancelada` });
});

// Marcar cita como completada (solo médicos)
router.patch('/:id/complete', verifyToken, isDoctor, (req, res) => {
  // appointmentController.completeAppointment
  res.json({ 
    message: `Cita ${req.params.id} completada`,
    notes: req.body.notes
  });
});

module.exports = router;