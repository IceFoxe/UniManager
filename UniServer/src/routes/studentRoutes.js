const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const StudentService = require('../services/studentService');
const StudentRepository = require('../repositories/StudentRepository');

module.exports = (sequelize) => {
    const studentRepository = new StudentRepository(sequelize);
    const studentService = new StudentService(studentRepository);
    const studentController = new StudentController(studentService);

    router.get('/', (req, res) => studentController.getStudents(req, res));
    router.post('/', (req, res) => studentController.createStudent(req, res));
    router.get('/:id', (req, res) => studentController.getStudentById(req, res));
    return router;
};