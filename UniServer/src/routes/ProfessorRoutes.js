const express = require('express');
const LogRepository = require("../Repositories/LogRepository");
const router = express.Router();

module.exports = (sequelize) => {
    const ProfessorRepository = require('../repositories/professorRepository');
    const LogRepository = require('../repositories/LogRepository');
    const AccountRepository = require('../repositories/AccountRepository');
    const EmployeeRepository = require('../repositories/EmployeeRepository');
    const ProfessorService = require('../services/professorService');
    const ProfessorController = require('../controllers/professorController');


    const logRepository = new LogRepository(sequelize);
    const accountRepository = new AccountRepository(sequelize);
    const employeeRepository = new EmployeeRepository(sequelize);
    const repository = new ProfessorRepository(sequelize);
    const service = new ProfessorService(repository, logRepository, accountRepository, employeeRepository);
    const controller = new ProfessorController(service);

    router.get('/', (req, res) => controller.getProfessors(req, res));
    router.get('/:id', (req, res) => controller.getProfessorById(req, res));
    router.post('/', (req, res) => controller.createProfessor(req, res));
    router.put('/:id', (req, res) => controller.updateProfessor(req, res));
    router.delete('/:id', (req, res) => controller.deleteProfessor(req, res));

    return router;
};