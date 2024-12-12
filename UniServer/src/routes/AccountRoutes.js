const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/accountController');
const AccountService = require('../services/studentService');
const AccountRepository = require('../repositories/StudentRepository');

module.exports = (sequelize) => {
    const accountRepository = new AccountRepository(sequelize);
    const accountService = new AccountService(accountRepository);
    const accountController = new AccountController(accountService);

    router.get('/', (req, res) => studentController.getStudents(req, res));
    router.get('/:id', (req, res) => studentController.getStudentById(req, res));
    return router;
};