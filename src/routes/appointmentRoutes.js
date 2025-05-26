const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Ruta para obtener médicos
router.get('/doctors', appointmentController.getDoctors);

// Rutas para citas
router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getUserAppointments);
router.delete('/:id', appointmentController.cancelAppointment);
router.put('/:id/diagnostic', appointmentController.updateDiagnostic);

module.exports = router;