const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');

const P1 = sequelize.define('p1', {
  id_paciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'pacientes',
      key: 'id_paciente'
    }
  },
  nss: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'p1',
  timestamps: false,
  freezeTableName: true
});

P1.belongsTo(Paciente, { foreignKey: 'id_paciente' });

module.exports = P1;
