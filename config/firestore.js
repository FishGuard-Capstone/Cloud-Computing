const express = require('express');
const router = express.Router();
const { initFirestore } = require('../config/firestore.js');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/fileUpload');

const db = initFirestore();

// Add New Story (Authenticated)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { caption, location } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!caption) {
      return res.status(400).json({ message: 'Caption is required' });
    }

    // Prepare story data
    const storyData = {
      userId,
      caption,
      location: location || null,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: db.FieldValue.serverTimestamp(),
      likes: 0,
      comments: []
    };

    // Add story to Firestore
    const storyRef = await db.collection('stories').add(storyData);

    res.status(201).json({ 
      message: 'Story added successfully', 
      storyId: storyRef.id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding story', error: error.message });
  }
});

// Add Story as Guest (No Authentication)
router.post('/guest', upload.single('image'), async (req, res) => {
  try {
    const { caption, location, username } = req.body;

    // Validate input
    if (!caption) {
      return res.status(400).json({ message: 'Caption is required' });
    }

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Prepare story data
    const storyData = {
      username,
      caption,
      location: location || null,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: db.FieldValue.serverTimestamp(),
      isGuest: true,
      likes: 0,
      comments: []
    };

    // Add story to Firestore
    const storyRef = await db.collection('stories').add(storyData);

    res.status(201).json({ 
      message: 'Guest story added successfully', 
      storyId: storyRef.id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding guest story', error: error.message });
  }
});

// Get All Stories
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Fetch stories with pagination
    const storiesSnapshot = await db.collection('stories')
      .orderBy('createdAt', 'desc')
      .offset((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .get();

    const stories = storiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get total count for pagination
    const totalSnapshot = await db.collection('stories').get();
    const total = totalSnapshot.size;

    res.json({
      stories,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalStories: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error: error.message });
  }
});

// Get Story Details
router.get('/:id', async (req, res) => {
  try {
    const storyId = req.params.id;

    // Fetch story details
    const storyDoc = await db.collection('stories').doc(storyId).get();

    if (!storyDoc.exists) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const storyData = {
      id: storyDoc.id,
      ...storyDoc.data()
    };

    res.json(storyData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story details', error: error.message });
  }
});

// Like a Story
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user.userId;

    // Transaction to handle concurrent likes
    const storyRef = db.collection('stories').doc(storyId);
    
    await db.runTransaction(async (transaction) => {
      const storyDoc = await transaction.get(storyRef);
      
      if (!storyDoc.exists) {
        throw new Error('Story not found');
      }

      // Increment likes
      const currentLikes = storyDoc.data().likes || 0;
      transaction.update(storyRef, { 
        likes: currentLikes + 1,
        likedBy: db.FieldValue.arrayUnion(userId)
      });
    });

    res.json({ message: 'Story liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking story', error: error.message });
  }
});

// Add Comment to Story
router.post('/:id/comment', authenticateToken, async (req, res) => {
  try {
    const storyId = req.params.id;
    const { text } = req.body;
    const userId = req.user.userId;

    // Validate comment
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    // Reference to the story
    const storyRef = db.collection('stories').doc(storyId);

    // Add comment
    await storyRef.update({
      comments: db.FieldValue.arrayUnion({
        userId,
        text,
        createdAt: db.FieldValue.serverTimestamp()
      })
    });

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

module.exports = router;