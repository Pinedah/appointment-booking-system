const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  licenseNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Establecer relación con el modelo User
Doctor.belongsTo(User, { foreignKey: 'userId' });

module.exports = Doctor;