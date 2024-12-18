const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const StudentService = require('../services/studentService');
const StudentRepository = require('../repositories/StudentRepository');
const LogRepository = require('../repositories/LogRepository');
const AccountRepository = require('../repositories/AccountRepository');
const authMiddleware = require("../middleware/auth");

module.exports = (sequelize) => {
    const studentRepository = new StudentRepository(sequelize);
    const logRepository = new LogRepository(sequelize);
    const accountRepository = new AccountRepository(sequelize);
    const studentService = new StudentService(studentRepository, logRepository, accountRepository);
    const studentController = new StudentController(studentService);


    router.get('/search', authMiddleware.auth,
        authMiddleware.checkPermission(['admin', 'professor', 'student']), (req, res) =>
            studentController.searchStudents(req, res));
    router.get('/', authMiddleware.auth,
        authMiddleware.checkPermission(['admin', 'professor', 'student']), (req, res) =>
            studentController.getAllStudents(req, res));
    router.post('/create', authMiddleware.auth,
        authMiddleware.checkPermission(['admin']), (req, res) =>
            studentController.createStudent(req, res));
    router.get('/:id', authMiddleware.auth,
        authMiddleware.checkPermission(['admin', 'professor', 'student']), (req, res) =>
            studentController.getStudentById(req, res));
    router.delete('/delete/:id', authMiddleware.auth,
        authMiddleware.checkPermission(['admin']), (req, res) =>
            studentController.delStudentById(req, res));
    router.get('/update/:id', authMiddleware.auth,
        authMiddleware.checkPermission(['admin', 'student']), (req, res) =>
            studentController.updateStudentById(req, res));
    router.get('/sudoUpdate/:id', authMiddleware.auth,
        authMiddleware.checkPermission(['admin']), (req, res) =>
            studentController.sudoUpdateStudentById(req, res));

    return router;
};