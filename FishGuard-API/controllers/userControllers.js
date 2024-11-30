const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      // Cek apakah email sudah terdaftar
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      // Buat user baru
      const userId = await User.create(username, email, password);
      
      res.status(201).json({ 
        message: 'Registrasi berhasil', 
        userId 
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Cari user berdasarkan email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      // Verifikasi password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.json({ 
        message: 'Login berhasil', 
        token,
        user: { id: user.id, username: user.username, email: user.email } 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;