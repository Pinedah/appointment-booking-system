const Auth = require('../models/Auth');
const Paciente = require('../models/Paciente');
const Medico = require('../models/Medico');
const P1 = require('../models/P1');
const P2 = require('../models/P2');
const Atiende = require('../models/Atiende');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Obtener perfil de usuario
exports.getUserProfile = async (req, res) => {
  try {
    // Obtener información de autenticación
    const userId = req.user.userId || req.user.id;
    const username = req.user.username || req.user.nombre;
    
    console.log('Datos de autenticación:', {
      userId,
      username,
      role: req.user.role,
      userType: req.user.userType
    });
    
    // Verificar si hay un header específico que indique el tipo de usuario
    const headerRole = req.headers['x-user-role'];
    const tokenRole = req.user.role;
    const tokenType = req.user.userType;
    
    // Verificar si es médico según diferentes criterios
    const requestForDoctor = headerRole === 'doctor' || 
                            tokenRole === 'doctor' || 
                            tokenType === 'medico';
                            
    console.log(`Obteniendo perfil para usuario: username=${username}, ID=${userId}`);
    console.log('¿Solicitud para médico?', requestForDoctor);
    
    // MEJORA: Primero buscar en la tabla Auth para obtener el ID correcto
    console.log(`Buscando registro Auth para username: ${username}`);
    const authRecord = await Auth.findOne({
      where: { username }
    });
    
    if (authRecord) {
      console.log('Registro Auth encontrado:', {
        id: authRecord.id,
        username: authRecord.username,
        id_medico: authRecord.id_medico,
        id_paciente: authRecord.id_paciente,
        role: authRecord.role
      });
      
      // Determinar si es médico basado en el registro de Auth
      const isDoctor = authRecord.role === 'doctor' || authRecord.id_medico;
      
      if (isDoctor && authRecord.id_medico) {
        // Es un médico, buscar sus datos
        console.log(`Buscando médico con ID: ${authRecord.id_medico}`);
        const medico = await Medico.findByPk(authRecord.id_medico);
        
        if (medico) {
          const userData = medico.toJSON();
          console.log('Datos de médico encontrados:', userData);
          
          // Contar citas
          try {
            const citaCount = await Atiende.count({
              where: { id_medico: authRecord.id_medico }
            });
            userData.citas_totales = citaCount;
          } catch (err) {
            console.error('Error al contar citas:', err);
            userData.citas_totales = 0;
          }
          
          // Devolver los datos del médico
          return res.json({ 
            userData, 
            userType: 'doctor',
            role: 'doctor'
          });
        } else {
          console.log(`No se encontró médico con ID: ${authRecord.id_medico}`);
        }
      } else if (authRecord.id_paciente) {
        // Es un paciente, buscar sus datos
        console.log(`Buscando paciente con ID: ${authRecord.id_paciente}`);
        const paciente = await Paciente.findByPk(authRecord.id_paciente);
        
        if (paciente) {
          userData = paciente.toJSON();
          console.log(`Datos de paciente encontrados:`, userData);
          
          // Buscar datos adicionales según el tipo de paciente
          if (paciente.tipo_paciente === 'P1') {
            const p1 = await P1.findOne({ where: { id_paciente: userId } });
            if (p1) {
              userData.nss = p1.nss;
            }
          } else if (paciente.tipo_paciente === 'P2') {
            const p2 = await P2.findOne({ where: { id_paciente: userId } });
            if (p2) {
              userData.num_poliza = p2.num_poliza;
            }
          }
          
          return res.json({ userData, userType: 'paciente' });
        } else {
          // Buscar en Auth para ver si hay referencia a paciente o médico
          const auth = await Auth.findOne({
            where: { username: req.user.username || req.user.nombre }
          });
          
          if (auth) {
            if (auth.id_medico) {
              // Es un médico, obtener sus datos
              const medico = await Medico.findByPk(auth.id_medico);
              if (medico) {
                userData = medico.toJSON();
                userData.citas_totales = await Atiende.count({
                  where: { id_medico: auth.id_medico }
                });
                return res.json({ userData, userType: 'doctor' });
              }
            } else if (auth.id_paciente) {
              // Es un paciente, obtener sus datos
              const paciente = await Paciente.findByPk(auth.id_paciente);
              if (paciente) {
                userData = paciente.toJSON();
                // Buscar datos adicionales según el tipo de paciente
                if (paciente.tipo_paciente === 'P1') {
                  const p1 = await P1.findOne({ where: { id_paciente: auth.id_paciente } });
                  if (p1) {
                    userData.nss = p1.nss;
                  }
                } else if (paciente.tipo_paciente === 'P2') {
                  const p2 = await P2.findOne({ where: { id_paciente: auth.id_paciente } });
                  if (p2) {
                    userData.num_poliza = p2.num_poliza;
                  }
                }
                
                return res.json({ userData, userType: 'paciente' });
              }
            }
          }
        }
      }
    } else {
      console.log(`No se encontró registro Auth para username: ${username}`);
    }
    
    // Si no encontró en Auth, continuar con la lógica existente
    // Esta parte se mantiene como fallback pero no debería ser necesaria
    let userData = null;
    
    // Intentar primero el rol indicado
    if (requestForDoctor) {
      // Buscar datos del médico
      console.log(`Buscando datos de médico para ID: ${userId}`);
      const medico = await Medico.findByPk(userId);
      
      if (medico) {
        userData = medico.toJSON();
        console.log(`Datos de médico encontrados:`, userData);
        
        // Contar total de citas asignadas al médico
        try {
          const citaCount = await Atiende.count({
            where: { id_medico: userId }
          });
          
          userData.citas_totales = citaCount;
          console.log(`Total de citas para médico ${userId}: ${citaCount}`);
        } catch (err) {
          console.error('Error al contar citas:', err);
          userData.citas_totales = 0;
        }
        
        // Devolver los datos inmediatamente
        return res.json({ userData, userType: 'doctor' });
      } else {
        console.log(`No se encontró médico con ID: ${userId}. Buscando en Auth...`);
        
        // Verificar si hay un id_medico en la tabla Auth
        const auth = await Auth.findOne({
          where: { username: req.user.username || req.user.nombre }
        });
        
        if (auth && auth.id_medico) {
          console.log(`Se encontró id_medico en Auth: ${auth.id_medico}`);
          
          const medicoAlt = await Medico.findByPk(auth.id_medico);
          if (medicoAlt) {
            userData = medicoAlt.toJSON();
            console.log(`Datos de médico encontrados por id_medico en Auth:`, userData);
            
            // Contar citas
            const citaCount = await Atiende.count({
              where: { id_medico: auth.id_medico }
            });
            userData.citas_totales = citaCount;
            
            return res.json({ userData, userType: 'doctor' });
          }
        }
      }
    }
    
    // Si no se encontró como médico o no se indicó que es médico, buscar como paciente
    if (!userData) {
      console.log(`Buscando datos de paciente para ID: ${userId}`);
      const paciente = await Paciente.findByPk(userId);
      
      if (paciente) {
        userData = paciente.toJSON();
        console.log(`Datos de paciente encontrados:`, userData);
        
        // Buscar datos adicionales según el tipo de paciente
        if (paciente.tipo_paciente === 'P1') {
          const p1 = await P1.findOne({ where: { id_paciente: userId } });
          if (p1) {
            userData.nss = p1.nss;
          }
        } else if (paciente.tipo_paciente === 'P2') {
          const p2 = await P2.findOne({ where: { id_paciente: userId } });
          if (p2) {
            userData.num_poliza = p2.num_poliza;
          }
        }
        
        return res.json({ userData, userType: 'paciente' });
      } else {
        // Buscar en Auth para ver si hay referencia a paciente o médico
        const auth = await Auth.findOne({
          where: { username: req.user.username || req.user.nombre }
        });
        
        if (auth) {
          if (auth.id_medico) {
            // Es un médico, obtener sus datos
            const medico = await Medico.findByPk(auth.id_medico);
            if (medico) {
              userData = medico.toJSON();
              userData.citas_totales = await Atiende.count({
                where: { id_medico: auth.id_medico }
              });
              return res.json({ userData, userType: 'doctor' });
            }
          } else if (auth.id_paciente) {
            // Es un paciente, obtener sus datos
            const paciente = await Paciente.findByPk(auth.id_paciente);
            if (paciente) {
              userData = paciente.toJSON();
              // Buscar datos adicionales según el tipo de paciente
              if (paciente.tipo_paciente === 'P1') {
                const p1 = await P1.findOne({ where: { id_paciente: auth.id_paciente } });
                if (p1) {
                  userData.nss = p1.nss;
                }
              } else if (paciente.tipo_paciente === 'P2') {
                const p2 = await P2.findOne({ where: { id_paciente: auth.id_paciente } });
                if (p2) {
                  userData.num_poliza = p2.num_poliza;
                }
              }
              
              return res.json({ userData, userType: 'paciente' });
            }
          }
        }
      }
    }
    
    if (!userData) {
      return res.status(404).json({ 
        message: `No se encontró información de usuario para username: ${username}`,
        token_info: {
          username,
          userId,
          role: tokenRole,
          userType: tokenType
        }
      });
    }
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({ 
      message: 'Error al obtener perfil de usuario',
      error: error.message
    });
  }
};

// Actualizar perfil de usuario
exports.updateUserProfile = async (req, res) => {
  // Simulación para desarrollo
  try {
    const userData = req.body;
    console.log('Actualizando datos:', userData);
    
    res.json({ 
      message: 'Perfil actualizado exitosamente (simulación)',
      updatedFields: Object.keys(userData)
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  // Simulación para desarrollo
  try {
    console.log('Simulando cambio de contraseña');
    
    res.json({ 
      message: 'Contraseña actualizada exitosamente (simulación)'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error al cambiar contraseña', error: error.message });
  }
};
