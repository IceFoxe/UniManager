const express = require('express');
const {auth, checkPermission} = require("../middleware/auth");
const LogRepository = require("../repositories/LogRepository");
const CourseRepository = require("../repositories/CourseRepository");
const CourseService = require("../Services/CourseService");
const CourseController = require("../Controllers/CourseController");
const router = express.Router();

module.exports = (sequelize) => {
    const logRepository = new LogRepository(sequelize);
    const courseRepository = new CourseRepository(sequelize);
    const courseService = new CourseService(courseRepository, logRepository);
    const courseController = new CourseController(courseService);

    router.post('/', auth,
        checkPermission(['admin']), (req, res) =>
            courseController.createCourse(req, res));

    router.get('/:id',  auth,
         checkPermission(['admin', 'professor', 'student']), (req, res) =>
            courseController.getCourseById(req, res));

    router.get('/',  auth,
         checkPermission(['admin', 'professor', 'student']), (req, res) =>
            courseController.getAllCourses(req, res));

    router.get('/program/:programId',  auth,
         checkPermission(['admin', 'professor', 'student']), (req, res) =>
            courseController.getCoursesByProgram(req, res));

    router.get('/student/:studentId',  auth,
         checkPermission(['admin', 'professor', 'student']), (req, res) =>
            courseController.getCoursesByStudentId(req, res));

    router.put('/:id',  auth,
         checkPermission(['admin']), (req, res) =>
            courseController.updateCourse(req, res));

    router.delete('/:id',  auth,
         checkPermission(['admin']), (req, res) =>
            courseController.deleteCourse(req, res));

    // Additional useful endpoints
    router.get('/:id/students',  auth,
         checkPermission(['admin', 'professor']), (req, res) =>
            courseController.getCourseStudents(req, res));

    router.get('/teacher/:teacherId',  auth,
         checkPermission(['admin', 'professor']), (req, res) =>
            courseController.getTeacherCourses(req, res));

    return router;
}