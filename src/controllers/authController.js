const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const Auth = require('../models/Auth');
const Paciente = require('../models/Paciente');
const P1 = require('../models/P1');
const P2 = require('../models/P2');
const Medico = require('../models/Medico');

// Registro de nuevo usuario (paciente)
exports.register = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { nombre, num_tel, tipo_paciente, nss, num_poliza, username, password } = req.body;

    console.log('Datos recibidos:', req.body);

    // Comprobar si el usuario ya existe
    const userExists = await Auth.findOne({ 
      where: { username },
      transaction
    });
    
    if (userExists) {
      await transaction.rollback();
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Crear el paciente
    const paciente = await Paciente.create({
      nombre,
      num_tel,
      tipo_paciente
    }, { transaction });

    console.log('Paciente creado:', paciente.toJSON());

    // Crear registro adicional según tipo de paciente
    if (tipo_paciente === 'P1' && nss) {
      await P1.create({
        id_paciente: paciente.id_paciente,
        nss
      }, { transaction });
      console.log('P1 creado con NSS:', nss);
    } else if (tipo_paciente === 'P2' && num_poliza) {
      await P2.create({
        id_paciente: paciente.id_paciente,
        num_poliza
      }, { transaction });
      console.log('P2 creado con póliza:', num_poliza);
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear registro de autenticación
    const auth = await Auth.create({
      username,
      password: hashedPassword,
      id_paciente: paciente.id_paciente,
      role: 'patient',
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction });

    console.log('Auth creado:', {
      id: auth.id,
      username: auth.username
    });

    // Confirmar transacción
    await transaction.commit();

    res.status(201).json({ 
      message: 'Usuario registrado correctamente',
      pacienteId: paciente.id_paciente
    });
  } catch (error) {
    // Revertir transacción en caso de error
    await transaction.rollback();
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error del servidor al registrar usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Intento de login para:', username);

    // Verificar que el usuario existe (sin asociaciones por ahora)
    const auth = await Auth.findOne({ where: { username } });

    if (!auth) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    
    // Una vez que tenemos el auth, buscamos los datos relacionados por separado
    let userData = null;
    let userType = null;
    let userId = null;
    
    // Determinar el tipo de usuario y cargar datos relacionados
    if (auth.id_medico) {
      console.log('Usuario es médico, ID:', auth.id_medico);
      try {
        const medico = await Medico.findByPk(auth.id_medico);
        if (medico) {
          userData = medico.toJSON();
          userType = 'medico';
          userId = auth.id_medico;
        }
      } catch (err) {
        console.error('Error al cargar datos de médico:', err);
      }
    } else if (auth.id_paciente) {
      console.log('Usuario es paciente, ID:', auth.id_paciente);
      try {
        const paciente = await Paciente.findByPk(auth.id_paciente);
        if (paciente) {
          userData = paciente.toJSON();
          userType = 'paciente';
          userId = auth.id_paciente;
        }
      } catch (err) {
        console.error('Error al cargar datos de paciente:', err);
      }
    }
    
    // Si no se pudo determinar el tipo, usar valores por defecto del auth
    if (!userType) {
      userType = auth.role === 'doctor' ? 'medico' : 'paciente';
    }
    
    console.log('Datos de usuario cargados:', {
      userType,
      userId,
      role: auth.role
    });
    
    // Generar token con información ampliada
    const token = jwt.sign(
      { 
        id: auth.id, 
        username, 
        role: auth.role,
        userType, 
        userId,
        id_medico: auth.id_medico,
        id_paciente: auth.id_paciente
      }, 
      process.env.JWT_SECRET || 'faxinaar',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Responder con token y datos de usuario
    res.json({
      token,
      user: {
        id: auth.id,
        username,
        role: auth.role,
        userType,
        userData
      }
    });
  } catch (error) {
    console.error('Error de login:', error);
    res.status(500).json({ 
      message: 'Error del servidor al iniciar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Registro de médico
exports.registerDoctor = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { nombre, tipo_medico, especialidad, licenseNumber, username, password } = req.body;

    console.log('Datos recibidos de médico:', req.body);

    // Comprobar si el usuario ya existe
    const userExists = await Auth.findOne({ 
      where: { username },
      transaction
    });
    
    if (userExists) {
      await transaction.rollback();
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Crear el médico usando el modelo importado directamente
    const medico = await Medico.create({
      nombre,
      tipo_medico
    }, { transaction });

    console.log('Médico creado:', medico.toJSON());

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear registro de autenticación
    const auth = await Auth.create({
      username,
      password: hashedPassword,
      id_medico: medico.id_medico,
      id_paciente: null,
      role: 'doctor',
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction });

    console.log('Auth para médico creado:', {
      id: auth.id,
      username: auth.username
    });

    // Confirmar transacción
    await transaction.commit();

    res.status(201).json({ 
      message: 'Médico registrado correctamente',
      medicoId: medico.id_medico
    });
  } catch (error) {
    // Revertir transacción en caso de error
    await transaction.rollback();
    console.error('Error en registro de médico:', error);
    res.status(500).json({ 
      message: 'Error del servidor al registrar médico',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};