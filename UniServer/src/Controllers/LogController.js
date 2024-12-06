class AuditLogController {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }

    async getLogs(req, res) {
        try {
            const filters = {
                account_id: req.query.account_id ? Number(req.query.account_id) : undefined,
                action: req.query.action,
                table_name: req.query.table_name,
                start_date: req.query.start_date ? new Date(req.query.start_date) : undefined,
                end_date: req.query.end_date ? new Date(req.query.end_date) : undefined,
                page: req.query.page,
                limit: req.query.limit
            };

            const logs = await this.auditLogService.searchLogs(filters);
            res.json(logs);
        } catch (error) {
            console.error('Error in getLogs:', error);
            res.status(500).json({ error: 'Failed to retrieve audit logs' });
        }
    }

    async getLogById(req, res) {
        try {
            const logId = Number(req.params.id);
            const log = await this.auditLogService.getLogById(logId);

            if (!log) {
                return res.status(404).json({ error: 'Audit log not found' });
            }

            res.json(log);
        } catch (error) {
            console.error('Error in getLogById:', error);
            res.status(500).json({ error: 'Failed to retrieve audit log' });
        }
    }

    async getLogsByAccountId(req, res) {
        try {
            const accountId = Number(req.params.accountId);
            const filters = {
                action: req.query.action,
                table_name: req.query.table_name,
                start_date: req.query.start_date ? new Date(req.query.start_date) : undefined,
                end_date: req.query.end_date ? new Date(req.query.end_date) : undefined,
                page: req.query.page,
                limit: req.query.limit
            };

            const logs = await this.auditLogService.getLogsByAccountId(accountId, filters);
            res.json(logs);
        } catch (error) {
            console.error('Error in getLogsByAccountId:', error);
            res.status(500).json({ error: 'Failed to retrieve audit logs' });
        }
    }
}

module.exports = AuditLogController;