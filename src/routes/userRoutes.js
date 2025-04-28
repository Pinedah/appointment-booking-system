const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Aquí normalmente importarías el controlador
// const userController = require('../controllers/userController');

// Obtener perfil del usuario
router.get('/profile', verifyToken, (req, res) => {
  // userController.getProfile
  res.json({ 
    message: 'Perfil de usuario',
    user: req.user
  });
});

// Actualizar perfil de usuario
router.put('/profile', verifyToken, (req, res) => {
  // userController.updateProfile
  res.json({ 
    message: 'Perfil actualizado',
    data: req.body
  });
});

// Obtener todos los usuarios (sólo admin)
router.get('/', verifyToken, isAdmin, (req, res) => {
  // userController.getAllUsers
  res.json({ message: 'Lista de usuarios' });
});

// Cambiar estado de usuario (activar/desactivar)
router.patch('/:id/status', verifyToken, isAdmin, (req, res) => {
  // userController.changeUserStatus
  res.json({ message: `Cambiar estado del usuario ${req.params.id}` });
});

module.exports = router;