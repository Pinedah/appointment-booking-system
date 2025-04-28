const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isDoctor } = require('../middlewares/auth');

// Aquí normalmente importarías el controlador
// const doctorController = require('../controllers/doctorController');

// Obtener todos los doctores
router.get('/', (req, res) => {
  // doctorController.getAllDoctors
  res.json({ message: 'Lista de doctores' });
});

// Obtener un doctor específico
router.get('/:id', (req, res) => {
  // doctorController.getDoctorById
  res.json({ message: `Detalles del doctor ${req.params.id}` });
});

// Registrar un nuevo doctor (solo admin)
router.post('/', verifyToken, isAdmin, (req, res) => {
  // doctorController.createDoctor
  res.json({ 
    message: 'Doctor registrado',
    doctor: req.body
  });
});

// Actualizar información de un doctor
router.put('/:id', verifyToken, isDoctor, (req, res) => {
  // doctorController.updateDoctor
  res.json({ 
    message: `Doctor ${req.params.id} actualizado`,
    doctor: req.body
  });
});

// Obtener horarios disponibles del doctor
router.get('/:id/availability', (req, res) => {
  // doctorController.getDoctorAvailability
  res.json({ 
    message: `Horarios disponibles del doctor ${req.params.id}`,
    date: req.query.date
  });
});

// Configurar horarios del doctor
router.post('/:id/schedule', verifyToken, isDoctor, (req, res) => {
  // doctorController.setDoctorSchedule
  res.json({ 
    message: `Horario configurado para doctor ${req.params.id}`,
    schedule: req.body
  });
});

// Obtener citas de un doctor
router.get('/:id/appointments', verifyToken, isDoctor, (req, res) => {
  // doctorController.getDoctorAppointments
  res.json({ message: `Citas del doctor ${req.params.id}` });
});

module.exports = router;