const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Inicialización de Express
const app = express();

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../../public')));

// Importar rutas
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const appointmentRoutes = require('../routes/appointmentRoutes');
const doctorRoutes = require('../routes/doctorRoutes');

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);

// Rutas para servir las vistas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/register.html'));
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
