const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auth = sequelize.define('Auth', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pacientes',
      key: 'id_paciente'
    }
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'medico',
      key: 'id_medico'
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'patient'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Auth',
  timestamps: true
});

module.exports = Auth;
