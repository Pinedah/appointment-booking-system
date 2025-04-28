const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'hospital_appointments',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Probar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(error => {
    console.error('Error al conectar con la base de datos:', error);
  });

module.exports = sequelize;