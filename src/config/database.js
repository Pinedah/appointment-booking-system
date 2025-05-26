const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión a la base de datos PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'test3',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'panke',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      // No queremos que modifique los nombres de las tablas existentes
      freezeTableName: true,
      // Desactivamos timestamps por defecto para tablas existentes
      timestamps: false
    }
  }
);

// Probar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos PostgreSQL establecida correctamente.');
  })
  .catch(error => {
    console.error('Error al conectar con la base de datos PostgreSQL:', error);
  });

// Exportamos sequelize directamente como default y también el objeto completo
module.exports = sequelize;
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;