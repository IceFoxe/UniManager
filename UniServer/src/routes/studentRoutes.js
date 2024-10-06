const express = require('express');
const StudentController = require('../EF/controllers/StudentController');

const router = express.Router();

router.get('/students', StudentController.getAllStudents);
router.get('/students/:id', StudentController.getStudentById);
router.get('/students/number/:studentNumber', StudentController.getStudentByStudentNumber);
router.post('/students', StudentController.createStudent);
router.put('/students/:id', StudentController.updateStudent);
router.delete('/students/:id', StudentController.deleteStudent);

module.exports = router;