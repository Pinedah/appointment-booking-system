const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado' });
    }

    console.log('Verificando token...');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'faxinaar');
      console.log('Token decodificado:', {
        id: decoded.id,
        username: decoded.username, 
        role: decoded.role,
        userType: decoded.userType,
        userId: decoded.userId,
        id_medico: decoded.id_medico,
        id_paciente: decoded.id_paciente
      });
      
      // Añadir datos del usuario al request
      req.user = decoded;
      
      // Verificar información adicional si es necesario
      if (!req.user.username) {
        const auth = await Auth.findByPk(decoded.id);
        if (auth) {
          req.user.username = auth.username;
          
          // Añadir IDs de médico o paciente si no están en el token
          if (!req.user.id_medico) req.user.id_medico = auth.id_medico;
          if (!req.user.id_paciente) req.user.id_paciente = auth.id_paciente;
          
          console.log('Datos complementarios añadidos:', {
            username: req.user.username,
            id_medico: req.user.id_medico,
            id_paciente: req.user.id_paciente
          });
        }
      }
      
      next();
    } catch (jwtError) {
      console.error('Error al verificar token JWT:', jwtError);
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token inválido' });
      } else if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado' });
      }
      
      return res.status(401).json({ message: 'Error en verificación de token' });
    }
  } catch (error) {
    console.error('Error general en verificación de token:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador' });
  }
  next();
};

exports.verifyDoctor = (req, res, next) => {
  if (req.user.userType !== 'medico' && req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de médico' });
  }
  next();
};
