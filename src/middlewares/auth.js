const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers['x-access-token'] || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No se proporcionó token de autenticación' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'Usuario no encontrado' });
    }

    // Excluir la contraseña
    user.password = undefined;
    
    // Agregar el usuario al objeto de solicitud
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Requiere permisos de administrador' });
  }
};

const isDoctor = (req, res, next) => {
  if (req.user && (req.user.role === 'doctor' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Requiere permisos de doctor' });
  }
};

module.exports = { verifyToken, isAdmin, isDoctor };