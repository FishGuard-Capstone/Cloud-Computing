const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {Firestore} = require('@google-cloud/firestore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Inisialisasi Firestore
const firestore = new Firestore({
    projectId: 'capstone-fish-guard',
    keyFilename: 'fishguard-key69.json',
    databaseId: 'fishguard69',
    settings: {
      cacheSizeBytes: 10 * 1024 * 1024,  // Cache size
      // Add timeout settings if needed
    }
  });

// Inisialisasi Express
const app = express();
const port = 8080;

// Middleware untuk parsing JSON body
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /register or /login to interact.');
  });

// Helper untuk menghasilkan token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Endpoint untuk Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password harus diisi' });
  }

  try {
    // Periksa apakah user sudah ada
    const userRef = firestore.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({ error: 'User sudah terdaftar' });
    }

    // Enkripsi password dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user di Firestore
    await userRef.set({
      email,
      password: hashedPassword
    });

    // Generate token JWT
    const token = generateToken(email);

    return res.status(201).json({ message: 'User berhasil terdaftar', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Endpoint untuk Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password harus diisi' });
  }

  try {
    // Ambil data user dari Firestore
    const userRef = firestore.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const user = userDoc.data();

    // Periksa apakah password valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password tidak valid' });
    }

    // Generate token JWT
    const token = generateToken(email);

    return res.status(200).json({ message: 'Login berhasil', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Endpoint yang dilindungi
app.get('/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token tidak ditemukan' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }

    res.status(200).json({ message: 'Akses berhasil ke konten yang dilindungi', userId: decoded.userId });
  });
});

// Konfigurasi multer untuk menangani upload file
const upload = multer({
    storage: multer.memoryStorage(), // Simpan file sementara di memory
    limits: { fileSize: 1 * 1024 * 1024 }, // Maksimum ukuran file 1MB
    fileFilter: (req, file, cb) => {
      // Verifikasi hanya gambar yang diizinkan
      const fileTypes = /jpeg|jpg|png|gif/;
      const mimetype = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('File harus berupa gambar dengan format JPEG, PNG, atau GIF.'));
      }
    }
  }).single('photo'); // Menggunakan single untuk hanya satu file dengan nama field 'photo'
  
  // Endpoint untuk menambahkan story
  app.post('/stories', upload, async (req, res) => {
    const { description, lat, lon } = req.body;
  
    if (!description || !req.file) {
      return res.status(400).json({ error: 'Description dan photo harus diisi' });
    }
  
    try {
      // Mengonversi gambar ke base64
      const base64Image = req.file.buffer.toString('base64');
  
      // Menyimpan gambar dalam Firestore sebagai base64
      const storyRef = firestore.collection('stories').doc();
      await storyRef.set({
        description,
        photo: base64Image,  // Menyimpan gambar dalam format base64
        lat: lat ? parseFloat(lat) : null,
        lon: lon ? parseFloat(lon) : null,
        createdAt: Firestore.Timestamp.now(),
      });
  
      return res.status(201).json({ message: 'Story berhasil diupload', photo: base64Image });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });
  
  // Endpoint untuk mendapatkan semua story
  app.get('/stories', async (req, res) => {
    try {
      const snapshot = await firestore.collection('stories').orderBy('createdAt', 'desc').get();
      if (snapshot.empty) {
        return res.status(404).json({ error: 'No stories found' });
      }
  
      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return res.status(200).json({ stories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });
  
  // Endpoint untuk mendapatkan detail story
  app.get('/stories/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const storyRef = firestore.collection('stories').doc(id);
      const storyDoc = await storyRef.get();
  
      if (!storyDoc.exists) {
        return res.status(404).json({ error: 'Story tidak ditemukan' });
      }
  
      return res.status(200).json({ story: storyDoc.data() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

// Mulai server
app.listen(port, () => {
  console.log(`Server berjalan di ${port}`);
});