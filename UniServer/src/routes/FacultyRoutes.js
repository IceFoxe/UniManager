const express = require('express');
const {auth, checkPermission} = require("../middleware/auth");
const router = express.Router();

module.exports = (sequelize) => {
    const FacultyRepository = require('../repositories/facultyRepository');
    const FacultyService = require('../services/facultyService');
    const FacultyController = require('../controllers/facultyController');

    const repository = new FacultyRepository(sequelize);
    const service = new FacultyService(repository);
    const controller = new FacultyController(service);
    router.get('/:id/programs', auth,
        checkPermission(['admin', 'professor', 'student']),(req, res) =>
            controller.getFacultyPrograms(req, res));
    router.get('/', auth,
        checkPermission(['admin', 'professor', 'student']),(req, res) =>
            controller.getFaculties(req, res));
    router.get('/:id', auth,
        checkPermission(['admin', 'professor', 'student']),(req, res) =>
            controller.getFacultyById(req, res));
    router.post('/create', auth,
        checkPermission(['admin']),(req, res) =>
            controller.createFaculty(req, res));
    router.put('/:id', auth,
        checkPermission(['admin']),(req, res) =>
            controller.updateFaculty(req, res));
    router.delete('/:id', auth,
        checkPermission(['admin']),(req, res) =>
            controller.deleteFaculty(req, res));

    return router;
};