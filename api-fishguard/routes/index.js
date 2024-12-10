const express = require('express');
const router = express.Router();

// Import route handlers
const authRoutes = require('./authRoutes');
const storyRoutes = require('./storyRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/stories', storyRoutes);

module.exports = router;