// storyRoutes.js
const express = require('express');
const router = express.Router();
const { initFirestore } = require('../config/firestore');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/fileUpload');

const db = initFirestore();

// Add New Story (Authenticated)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { caption, location } = req.body;
    const userId = req.user.id;

    // Validasi input
    if (!caption) {
      return res.status(400).json({ message: 'Caption is required' });
    }

    // Persiapkan data story
    const storyData = {
      userId,
      caption,
      location: location || null,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: db.FieldValue.serverTimestamp(),
      likes: 0,
      comments: []
    };

    // Tambahkan story ke Firestore
    const storyRef = await db.collection('stories').add(storyData);

    res.status(201).json({ 
      message: 'Story added successfully', 
      storyId: storyRef.id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding story', error: error.message });
  }
});

module.exports = router;