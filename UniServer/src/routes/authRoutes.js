const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  // Adjust path as needed

// Login route - POST /api/auth/login
router.post('/login', authController.login);

// Registration route - POST /api/auth/register
router.post('/register', authController.register);

module.exports = router;