const sequelize = require('../config/database');
const Paciente = require('./Paciente');
const Medico = require('./Medico');
const Auth = require('./Auth');
const Cita = require('./Cita');
const Agendan = require('./Agendan');
const Atiende = require('./Atiende');
const P1 = require('./P1');
const P2 = require('./P2');

// Definir correctamente las asociaciones
Auth.belongsTo(Paciente, { foreignKey: 'id_paciente', as: 'paciente' });
Paciente.hasOne(Auth, { foreignKey: 'id_paciente' });

Auth.belongsTo(Medico, { foreignKey: 'id_medico', as: 'medico' });
Medico.hasOne(Auth, { foreignKey: 'id_medico' });

// Asociaciones paciente-citas
Paciente.belongsToMany(Cita, { through: Agendan, foreignKey: 'id_paciente', as: 'citas' });
Cita.belongsToMany(Paciente, { through: Agendan, foreignKey: 'id_cita', as: 'pacientes' });

// Asociaciones médico-citas
Medico.belongsToMany(Cita, { through: Atiende, foreignKey: 'id_medico', as: 'citas' });
Cita.belongsToMany(Medico, { through: Atiende, foreignKey: 'id_cita', as: 'medicos' });

// Asociaciones para pacientes especiales
P1.belongsTo(Paciente, { foreignKey: 'id_paciente' });
P2.belongsTo(Paciente, { foreignKey: 'id_paciente' });
Paciente.hasOne(P1, { foreignKey: 'id_paciente' });
Paciente.hasOne(P2, { foreignKey: 'id_paciente' });

module.exports = {
  sequelize,
  Paciente,
  Medico,
  Auth,
  Cita,
  Agendan,
  Atiende,
  P1,
  P2
};