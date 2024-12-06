const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
    const FacultyRepository = require('../repositories/facultyRepository');
    const FacultyService = require('../services/facultyService');
    const FacultyController = require('../controllers/facultyController');

    const repository = new FacultyRepository(sequelize);
    const service = new FacultyService(repository);
    const controller = new FacultyController(service);
    router.get('/:id/programs', (req, res) => controller.getFacultyPrograms(req, res));
    router.get('/', (req, res) => controller.getFaculties(req, res));
    router.get('/:id', (req, res) => controller.getFacultyById(req, res));
    router.post('/', (req, res) => controller.createFaculty(req, res));
    router.put('/:id', (req, res) => controller.updateFaculty(req, res));
    router.delete('/:id', (req, res) => controller.deleteFaculty(req, res));

    return router;
};