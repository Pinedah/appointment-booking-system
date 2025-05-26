const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Atiende = sequelize.define('atiende', {
  id_medico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'medico',
      key: 'id_medico'
    }
  },
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'cita',
      key: 'id_cita'
    }
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'atiende',
  timestamps: false
});

module.exports = Atiende;
