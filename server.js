const express = require('express');
const app = express();
const { authRoutes, storyRoutes } = require('./api-fishguard/routes');
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/story', storyRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});

module.exports = app;