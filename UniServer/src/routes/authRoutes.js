const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');
const authMiddleware = require("../middleware/auth");  // Adjust path as needed


router.post('/login', authController.login);

router.post('/register', authMiddleware.auth,
    authMiddleware.checkPermission('Admin'),
    authController.register);

module.exports = router;