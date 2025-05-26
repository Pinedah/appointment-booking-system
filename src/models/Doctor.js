const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Doctor = sequelize.define('Doctors', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  specialty: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  licenseNumber: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'Doctors',
  timestamps: true
});

// Definir la relación
Doctor.belongsTo(User, { foreignKey: 'userId' });

module.exports = Doctor;