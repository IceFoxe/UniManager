const express = require('express');
const {checkPermission, auth} = require("../middleware/auth");
const router = express.Router();
const ProgramRepository = require("../Repositories/ProgramRepository");
const ProgramService = require("../Services/ProgramService");
const ProgramController = require("../Controllers/ProgramController");

module.exports = (sequelize) => {
    const programRepository = new ProgramRepository(sequelize);
    const programService = new ProgramService(programRepository);
    const programController = new ProgramController(programService);

    router.post('/create', auth,
        checkPermission(['admin']), (req, res) =>
            programController.createProgram(req, res));

    router.get('/:id', auth,
        checkPermission(['admin', 'professor', 'student']), (req, res) =>
            programController.getProgramById(req, res));

    router.get('/', auth,
        checkPermission(['admin', 'professor', 'student']), (req, res) =>
            programController.getAllPrograms(req, res));

    router.get('/faculty/:facultyId', auth,
        checkPermission(['admin', 'professor', 'student']), (req, res) =>
            programController.getProgramsByFaculty(req, res));

    router.put('/:id', auth,
        checkPermission(['admin']), (req, res) =>
            programController.updateProgram(req, res));

    router.delete('/:id', auth,
        checkPermission(['admin']), (req, res) =>
            programController.deleteProgram(req, res));

    return router;
};