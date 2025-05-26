require('dotenv').config();
const db = require('./src/config/database');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas de autenticación
const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Importante: importar las asociaciones
require('./src/models/index'); // Esto establece las asociaciones entre modelos

// Usar un puerto diferente si el 3000 está en uso
const PORT = process.env.PORT || 3001;

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurar motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes); // Agregar esta línea

// Rutas para páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/agendar-cita', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'agendar-cita.html'));
});

app.get('/mis-citas', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mis-citas.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'perfil.html'));
});

// Agregar nuevas rutas para las páginas adicionales
app.get('/quienes-somos', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'quienes-somos.html'));
});

app.get('/servicios', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'servicios.html'));
});

app.get('/contacto', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contacto.html'));
});

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

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});