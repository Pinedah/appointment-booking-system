const sequelize = require('../config/database');
const User = require('./User');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');

// Establecer asociaciones adicionales si es necesario

module.exports = {
  sequelize,
  User,
  Doctor,
  Appointment
};