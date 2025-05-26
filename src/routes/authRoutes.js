const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Verificar que los métodos del controlador existen
console.log('Métodos disponibles en authController:', Object.keys(authController));

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/register-doctor', authController.registerDoctor);
router.post('/login', authController.login);

module.exports = router;