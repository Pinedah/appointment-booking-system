const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('cita', {
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'scheduled',
    // Los posibles valores serían: scheduled, completed, cancelled
    validate: {
      isIn: [['scheduled', 'completed', 'cancelled']]
    }
  }
}, {
  tableName: 'cita',
  timestamps: false
});

module.exports = Cita;
