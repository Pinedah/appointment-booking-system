const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agendan = sequelize.define('agendan', {
  id_paciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'pacientes',
      key: 'id_paciente'
    }
  },
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'cita',
      key: 'id_cita'
    }
  }
}, {
  tableName: 'agendan',
  timestamps: false
});

module.exports = Agendan;
