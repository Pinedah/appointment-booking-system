require('dotenv').config();
const app = require('./src/config/server');
const db = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Sincronizar modelos con la base de datos
// En producción, se recomienda { force: false }
db.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });