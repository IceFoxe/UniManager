const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
    const AuditLogRepository = require('../repositories/LogRepository');
    const AuditLogService = require('../services/LogService');
    const AuditLogController = require('../controllers/LogController');

    const auditLogRepository = new AuditLogRepository(sequelize);
    const auditLogService = new AuditLogService(auditLogRepository);
    const auditLogController = new AuditLogController(auditLogService);

    router.get('/', (req, res) => auditLogController.getLogs(req, res));
    router.get('/:id', (req, res) => auditLogController.getLogById(req, res));
    router.get('/account/:accountId', (req, res) => auditLogController.getLogsByAccountId(req, res));

    return router;
};