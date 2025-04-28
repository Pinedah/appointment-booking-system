const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Función para generar un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Crear nuevo usuario
    const user = await User.create({
      firstName,
      lastName,
      email,
      password, // Se encripta automáticamente mediante los hooks del modelo
      phone,
      dateOfBirth,
      role: 'patient' // Por defecto, los registros nuevos son pacientes
    });

    // Excluir la contraseña de la respuesta
    const userData = { ...user.get() };
    delete userData.password;

    // Generar token JWT
    const token = generateToken(user);

    // Configurar cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({ message: 'Cuenta desactivada. Contacte al administrador' });
    }

    // Excluir la contraseña de la respuesta
    const userData = { ...user.get() };
    delete userData.password;

    // Generar token JWT
    const token = generateToken(user);

    // Configurar cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Cerrar sesión
exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};

// Verificar estado de autenticación
exports.checkAuth = async (req, res) => {
  try {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al verificar autenticación' });
  }
};