const express = require('express');
const AccountController = require('../EF/controllers/AccountController');

const router = express.Router();

router.get('/accounts', AccountController.getAllAccounts);
router.get('/accounts/:id', AccountController.getAccountById);
router.post('/accounts', AccountController.createAccount);
router.put('/accounts/:id', AccountController.updateAccount);
router.delete('/accounts/:id', AccountController.deleteAccount);
router.post('/login', AccountController.login);
router.post('/accounts/:id/change-password', AccountController.changePassword);

module.exports = router;