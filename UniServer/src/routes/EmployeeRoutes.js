const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');
const EmployeeService = require('../services/EmployeeService');
const EmployeeRepository = require('../repositories/EmployeeRepository');
const LogRepository = require('../repositories/LogRepository');
const AccountRepository = require('../repositories/AccountRepository');
const authMiddleware = require("../middleware/auth");

module.exports = (sequelize) => {
    const employeeRepository = new EmployeeRepository(sequelize);
    const logRepository = new LogRepository(sequelize);
    const accountRepository = new AccountRepository(sequelize);
    const employeeService = new EmployeeService(employeeRepository, logRepository, accountRepository);
    const employeeController = new EmployeeController(employeeService);

    // Search employees with filters
    router.get('/search',
        authMiddleware.auth,
        authMiddleware.checkPermission(['admin']),
        (req, res) => employeeController.searchEmployees(req, res)
    );

    // Get all employees
    router.get('/',
        authMiddleware.auth,
        authMiddleware.checkPermission(['admin']),
        (req, res) => employeeController.getAllEmployees(req, res)
    );

    // Create new employee
    router.post('/create',
        authMiddleware.auth,
        authMiddleware.checkPermission(['admin']),
        (req, res) => employeeController.createEmployee(req, res)
    );

    // Get employee by ID
    router.get('/:id',
        authMiddleware.auth,
        authMiddleware.checkPermission(['admin']),
        (req, res) => employeeController.getEmployeeById(req, res)
    );

    // Delete employee by ID
    router.delete('/delete/:id',
        authMiddleware.auth,
        authMiddleware.checkPermission(['admin']),
        (req, res) => employeeController.deleteEmployeeById(req, res)
    );

    // Update employee by ID
    router.put('/update/:id',
        authMiddleware.auth,
        authMiddleware.checkPermission(['admin']),
        (req, res) => employeeController.updateEmployeeById(req, res)
    );

    return router;
};