const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
    const ProfessorRepository = require('../repositories/professorRepository');
    const ProfessorService = require('../services/professorService');
    const ProfessorController = require('../controllers/professorController');

    const repository = new ProfessorRepository(sequelize);
    const service = new ProfessorService(repository);
    const controller = new ProfessorController(service);

    router.get('/', (req, res) => controller.getProfessors(req, res));
    router.get('/:id', (req, res) => controller.getProfessorById(req, res));
    router.post('/', (req, res) => controller.createProfessor(req, res));
    router.put('/:id', (req, res) => controller.updateProfessor(req, res));
    router.delete('/:id', (req, res) => controller.deleteProfessor(req, res));

    return router;
};