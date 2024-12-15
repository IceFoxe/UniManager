const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh.bind(authController));
module.exports = router;