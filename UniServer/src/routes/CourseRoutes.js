const express = require('express');
const {auth, checkPermission} = require("../middleware/auth");
const router = express.Router();

module.exports = (sequelize) => {
    const courseRepository = new CourseRepository(sequelize);
    const courseService = new CourseService(courseRepository);
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