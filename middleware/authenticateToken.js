const jwt = require('jsonwebtoken');
const { initFirestore } = require('../config/firestore');

const db = initFirestore();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Token not provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    try {
      // Cek apakah user ada di Firestore
      const userDoc = await db.collection('users').doc(user.userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found in database' });
      }

      // Tambahkan data user ke request
      req.user = { id: user.userId, ...userDoc.data() };

      // Lanjutkan ke handler berikutnya
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error validating user', error: error.message });
    }
  });
};

module.exports = authenticateToken;