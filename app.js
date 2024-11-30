const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./utils/errorHandler');

dotenv.config();

const app = express();

// Konfigurasi CORS dengan opsi tambahan untuk keamanan
const corsOptions = {
  origin: function (origin, callback) {
    // Izinkan requests dari origin tertentu atau dari localhost
    const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-domain.com'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware logging (opsional, untuk debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Gunakan routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

// Middleware untuk handle 404 (route tidak ditemukan)
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint tidak ditemukan',
    path: req.path
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Listening on all network interfaces`);
});

// Tangani shutdown server dengan grace
process.on('SIGINT', () => {
  console.log('Server ditutup');
  server.close(() => {
    console.log('Proses server dihentikan');
    process.exit(0);
  });
});