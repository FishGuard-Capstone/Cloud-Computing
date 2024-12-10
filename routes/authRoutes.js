const express = require('express');
const router = express.Router();
const { initFirebase } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = initFirebase();

// Register Endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();
    
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const userRef = await db.collection('users').add({
      username,
      email,
      password: hashedPassword,
      createdAt: db.FieldValue.serverTimestamp()
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: userRef.id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();
    
    if (userSnapshot.empty) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Get user data
    const userData = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;

    // Compare passwords
    const isMatch = await bcrypt.compare(password, userData.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId, email: email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login successful', 
      token: token,
      user: {
        id: userId,
        username: userData.username,
        email: userData.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
});

module.exports = router;