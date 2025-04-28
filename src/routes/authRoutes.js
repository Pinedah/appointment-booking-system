const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Rutas protegidas
router.get('/me', verifyToken, authController.checkAuth);

module.exports = router;