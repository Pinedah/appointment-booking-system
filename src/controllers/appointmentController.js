const sequelize = require('../config/database');
const Cita = require('../models/Cita');
const Agendan = require('../models/Agendan');
const Atiende = require('../models/Atiende');
const Paciente = require('../models/Paciente');
const Medico = require('../models/Medico');

// Crear una nueva cita
exports.createAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { doctorId, date, time, reason, notes } = req.body;
    const userId = req.user.userId; // Obtenido del token JWT
    
    console.log('Datos de la cita:', { doctorId, date, time, reason, notes, userId });
    
    // Crear la cita en la tabla cita
    const newCita = await Cita.create({
      fecha: date,
      hora: time,
      motivo: reason
    }, { transaction });
    
    console.log('Cita creada:', newCita.toJSON());
    
    // Crear relación en agendan (paciente-cita)
    await Agendan.create({
      id_paciente: userId,
      id_cita: newCita.id_cita
    }, { transaction });
    
    // Crear relación en atiende (médico-cita)
    await Atiende.create({
      id_medico: doctorId,
      id_cita: newCita.id_cita,
      diagnostico: notes // Guardar las notas como diagnóstico inicial
    }, { transaction });
    
    // Confirmar transacción
    await transaction.commit();
    
    res.status(201).json({
      message: 'Cita agendada exitosamente',
      appointment: {
        id: newCita.id_cita,
        date,
        time,
        reason
      }
    });
  } catch (error) {
    // Revertir transacción en caso de error
    await transaction.rollback();
    console.error('Error al agendar cita:', error);
    res.status(500).json({
      message: 'Error al agendar la cita',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancelar cita
exports.cancelAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    console.log(`Intentando cancelar cita ${id} para usuario ${userId}`);
    
    // Verificar que la cita pertenece al usuario
    const agendanRecord = await Agendan.findOne({
      where: { 
        id_cita: id,
        id_paciente: userId
      },
      transaction
    });
    
    if (!agendanRecord) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Cita no encontrada o no tienes permiso para cancelarla' });
    }
    
    // Encontrar la cita
    const cita = await Cita.findByPk(id, { transaction });
    
    if (!cita) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    
    console.log('Cita encontrada, actualizando estado a cancelled');
    
    // Actualizar el estado de la cita a "cancelled" en lugar de eliminarla
    await cita.update({
      estado: 'cancelled'
    }, { transaction });
    
    console.log('Cita marcada como cancelada exitosamente');
    
    await transaction.commit();
    
    res.json({ 
      message: 'Cita cancelada exitosamente',
      appointment: {
        id: cita.id_cita,
        estado: 'cancelled'
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al cancelar cita:', error);
    res.status(500).json({ 
      message: 'Error al cancelar la cita',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Listar médicos disponibles
exports.getDoctors = async (req, res) => {
  try {
    const { type } = req.query;
    
    let whereClause = {};
    if (type) {
      whereClause.tipo_medico = type;
    }
    
    const doctors = await Medico.findAll({
      where: whereClause,
      attributes: ['id_medico', 'nombre', 'tipo_medico']
    });
    
    console.log(`Médicos encontrados (tipo: ${type}):`, doctors.length);
    res.json(doctors);
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    res.status(500).json({ 
      message: 'Error al obtener la lista de médicos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener citas de un usuario (paciente o médico)
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.userId; // ID del usuario autenticado
    const userType = req.user.userType || 'paciente'; // Tipo de usuario (paciente o medico)
    
    console.log('Obteniendo citas para el usuario:', userId, 'tipo:', userType);
    
    let citaIds = [];
    
    if (userType === 'paciente') {
      // Si es paciente, buscar citas a través de la tabla agendan
      const agendanRecords = await Agendan.findAll({
        where: { id_paciente: userId }
      });
      citaIds = agendanRecords.map(record => record.id_cita);
      console.log('IDs de citas de paciente encontradas:', citaIds);
    } else if (userType === 'medico') {
      // Si es médico, buscar citas a través de la tabla atiende
      const atiendeRecords = await Atiende.findAll({
        where: { id_medico: userId }
      });
      citaIds = atiendeRecords.map(record => record.id_cita);
      console.log('IDs de citas de médico encontradas:', citaIds);
    }
    
    if (citaIds.length === 0) {
      return res.json({ appointments: [] });
    }
    
    // Buscar información completa de las citas
    const citas = await Cita.findAll({
      where: { id_cita: citaIds }
    });
    
    // Construir información detallada según el tipo de usuario
    const citasDetalladas = await Promise.all(
      citas.map(async (cita) => {
        // Buscar la relación atiende para esta cita
        const atiende = await Atiende.findOne({
          where: { id_cita: cita.id_cita }
        });
        
        // Datos para rellenar
        let nombreMedico = 'Médico no asignado';
        let diagnostico = '';
        let nombrePaciente = 'Paciente no asignado';
        
        // Buscar datos del médico
        if (atiende) {
          const medico = await Medico.findByPk(atiende.id_medico);
          if (medico) {
            nombreMedico = medico.nombre;
          }
          diagnostico = atiende.diagnostico || '';
        }
        
        // Buscar datos del paciente si es un médico quien consulta
        if (userType === 'medico') {
          const agendan = await Agendan.findOne({
            where: { id_cita: cita.id_cita }
          });
          
          if (agendan) {
            const paciente = await Paciente.findByPk(agendan.id_paciente);
            if (paciente) {
              nombrePaciente = paciente.nombre;
            }
          }
        }
        
        return {
          id_cita: cita.id_cita,
          fecha: cita.fecha,
          hora: cita.hora,
          motivo: cita.motivo,
          doctor: nombreMedico,
          paciente: nombrePaciente,
          diagnostico: diagnostico,
          estado: cita.estado || 'scheduled',
          es_medico: userType === 'medico'
        };
      })
    );
    
    console.log(`Citas procesadas para ${userType}:`, citasDetalladas.length);
    res.json({ appointments: citasDetalladas });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ 
      message: 'Error al obtener las citas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Actualizar diagnóstico (solo para médicos)
exports.updateDiagnostic = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { diagnostic } = req.body;
    const userId = req.user.userId;
    const userType = req.user.userType;
    
    console.log(`Intentando actualizar diagnóstico para cita ${id}`);
    
    // Verificar que el usuario es un médico
    if (userType !== 'medico') {
      await transaction.rollback();
      return res.status(403).json({ message: 'Solo los médicos pueden actualizar diagnósticos' });
    }
    
    // Verificar que la cita pertenece al médico
    const atiendeRecord = await Atiende.findOne({
      where: { 
        id_cita: id,
        id_medico: userId
      },
      transaction
    });
    
    if (!atiendeRecord) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Cita no encontrada o no tienes permiso para actualizar' });
    }
    
    // Actualizar el diagnóstico
    await atiendeRecord.update({
      diagnostico: diagnostic
    }, { transaction });
    
    console.log('Diagnóstico actualizado exitosamente');
    
    await transaction.commit();
    
    res.json({ 
      message: 'Diagnóstico actualizado exitosamente',
      appointment: {
        id: parseInt(id),
        diagnostico: diagnostic
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar diagnóstico:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el diagnóstico',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
