const express = require('express');
const app = express();
const { authRoutes, storyRoutes } = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Routes
app.use('/auth', authRoutes);
app.use('/story', storyRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;