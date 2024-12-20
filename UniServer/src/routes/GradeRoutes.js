const express = require('express');
const {checkPermission, auth} = require("../middleware/auth");
const router = express.Router();
const GradeRepository = require('../Repositories/GradeRepository')
const GradeService = require('../Services/GradeService')
const GradeController = require('../Controllers/GradeController')
const LogRepository = require("../Repositories/LogRepository");

module.exports = (sequelize) => {
    const gradeRepository = new GradeRepository(sequelize);
    const logRepository = new LogRepository(sequelize);
    const gradeService = new GradeService(gradeRepository, logRepository);
    const gradeController = new GradeController(gradeService);
    
    router.post('/create',  auth,
         checkPermission(['admin', 'professor']), (req, res) =>
            gradeController.createGrade(req, res));
    
    router.get('/student/:studentId',  auth,
         checkPermission(['admin', 'professor', 'student']), (req, res) =>
            gradeController.getStudentGrades(req, res));
    
    router.get('/course/:courseId',  auth,
         checkPermission(['admin', 'professor']), (req, res) =>
            gradeController.getCourseGrades(req, res));
    
    router.put('/:id', auth,
        checkPermission(['admin', 'professor']), (req, res) =>
            gradeController.updateGrade(req, res));
    
    router.delete('/:id',  auth,
         checkPermission(['admin']), (req, res) =>
            gradeController.deleteGrade(req, res));

    return router;
};