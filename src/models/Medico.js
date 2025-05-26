const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medico = sequelize.define('medico', {
  id_medico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo_medico: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['General', 'Especialidad']]
    }
  }
}, {
  tableName: 'medico',
  timestamps: false,
  freezeTableName: true
});

module.exports = Medico;
