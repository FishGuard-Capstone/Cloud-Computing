const express = require('express');
const UserController = require('../controllers/userController');
const { validateUser, handleValidationErrors } = require('../utils/validation');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register', 
  validateUser, 
  handleValidationErrors, 
  UserController.register
);

router.post('/login', UserController.login);
router.get('/profile', authMiddleware, UserController.getUserProfile);

module.exports = router;