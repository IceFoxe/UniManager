const express = require('express');

const permissionMiddleware = require('../middleware/permission');
const FacultyController = require('../EF/controllers/FacultyController');
const GradeController = require('../EF/controllers/GradeController');

const router = express.Router();

router.get('/faculties', permissionMiddleware('VIEW_GRADES'), FacultyController.getAllFaculties);
router.post('/faculties', permissionMiddleware('VIEW_GRADES'), FacultyController.createFaculty);
router.get('/faculties/:id', permissionMiddleware('VIEW_GRADES'), FacultyController.getFacultyById);
router.put('/faculties/:id', permissionMiddleware('VIEW_GRADES'), FacultyController.updateFaculty);
router.delete('/faculties/:id', permissionMiddleware('VIEW_GRADES'), FacultyController.deleteFaculty);

module.exports = router;