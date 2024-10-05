const express = require('express');
const FacultyController = require('../EF/controllers/FacultyController');
const StudentController = require('../EF/controllers/StudentController');
const express = require('express');
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const GradeController = require('../EF/controllers/GradeController');
const router = express.Router();
router.use(authMiddleware);

router.get('/faculties', permissionMiddleware('VIEW_GRADES'), FacultyController.getAllFaculties);
router.post('/faculties', permissionMiddleware('VIEW_GRADES'), FacultyController.createFaculty);
router.get('/faculties/:id', permissionMiddleware('VIEW_GRADES'), FacultyController.getFacultyById);
router.put('/faculties/:id', permissionMiddleware('VIEW_GRADES'), FacultyController.updateFaculty);
router.delete('/faculties/:id', permissionMiddleware('VIEW_GRADES'), FacultyController.deleteFaculty);

router.get('/students', permissionMiddleware('VIEW_GRADES'), StudentController.getAllStudents);
router.post('/students', permissionMiddleware('VIEW_GRADES'), StudentController.createStudent);
router.get('/students/:id', permissionMiddleware('VIEW_GRADES'), StudentController.getStudentById);
router.put('/students/:id', permissionMiddleware('VIEW_GRADES'), StudentController.updateStudent);
router.delete('/students/:id', permissionMiddleware('VIEW_GRADES'), StudentController.deleteStudent);

module.exports = router;