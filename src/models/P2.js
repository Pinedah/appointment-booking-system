const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');

const P2 = sequelize.define('p2', {
  id_paciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'pacientes',
      key: 'id_paciente'
    }
  },
  num_poliza: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'p2',
  timestamps: false,
  freezeTableName: true
});

P2.belongsTo(Paciente, { foreignKey: 'id_paciente' });

module.exports = P2;
