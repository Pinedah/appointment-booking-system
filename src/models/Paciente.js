const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('pacientes', {
  id_paciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  num_tel: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  tipo_paciente: {
    type: DataTypes.STRING(2),
    allowNull: true,
    validate: {
      isIn: [['P1', 'P2']]
    }
  }
}, {
  tableName: 'pacientes',
  timestamps: false,
  freezeTableName: true
});

module.exports = Paciente;
