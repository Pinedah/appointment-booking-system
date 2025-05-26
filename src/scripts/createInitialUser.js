require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Auth = require('../models/Auth');
const Paciente = require('../models/Paciente');

async function createInitialUser() {
  try {
    // Datos del usuario a crear
    const userData = {
      username: 'usuario1',
      password: 'password123', // ¡Asegúrate de usar una contraseña segura en producción!
      nombre: 'Usuario Prueba',
      num_tel: '555-123-4567',
      tipo_paciente: 'P1'
    };

    // Inicializar conexión
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    // Comprobar si el usuario ya existe
    const existingUser = await Auth.findOne({
      where: { username: userData.username }
    });

    if (existingUser) {
      console.log('El usuario ya existe. No se creará uno nuevo.');
      await sequelize.close();
      return;
    }

    // Crear paciente
    const paciente = await Paciente.create({
      nombre: userData.nombre,
      num_tel: userData.num_tel,
      tipo_paciente: userData.tipo_paciente
    });

    console.log('Paciente creado:', paciente.toJSON());

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Crear cuenta de autenticación
    const auth = await Auth.create({
      username: userData.username,
      password: hashedPassword,
      id_paciente: paciente.id_paciente,
      role: 'patient',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Usuario de autenticación creado:', {
      id: auth.id,
      username: auth.username,
      role: auth.role
    });

    console.log('Usuario inicial creado exitosamente.');
    
    // Cerrar conexión
    await sequelize.close();

  } catch (error) {
    console.error('Error al crear usuario inicial:', error);
  }
}

// Ejecutar función
createInitialUser();
