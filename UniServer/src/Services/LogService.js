// services/auditLogService.js

/**
 * @typedef {Object} AuditLog
 * @property {number} log_id
 * @property {number} account_id
 * @property {Date} [timestamp]
 * @property {('CREATE'|'UPDATE'|'DELETE'|'LOGIN'|'LOGOUT'|'OTHER')} [action]
 * @property {string} [table_name]
 * @property {number} [record_id]
 * @property {string} [old_values]
 * @property {string} [new_values]
 * @property {string} [ip_address]
 * @property {string} [user_agent]
 * @property {Date} created_at
 */

class AuditLogService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * @param {Object} filters
     * @param {number} [filters.account_id]
     * @param {string} [filters.action]
     * @param {string} [filters.table_name]
     * @param {Date} [filters.start_date]
     * @param {Date} [filters.end_date]
     * @param {number} [filters.page]
     * @param {number} [filters.limit]
     */
    async searchLogs(filters) {
        const searchParams = {
            account_id: filters.account_id,
            action: filters.action,
            table_name: filters.table_name,
            start_date: filters.start_date,
            end_date: filters.end_date,
            page: parseInt(filters.page) || 1,
            limit: parseInt(filters.limit) || 10
        };

        const result = await this.auditLogRepository.searchLogs(searchParams);

        return {
            data: result.data,
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    /**
     * @param {number} logId
     * @returns {Promise<AuditLog|null>}
     */
    async getLogById(logId) {
        return this.auditLogRepository.findById(logId);
    }

    /**
     * @param {number} accountId
     * @param {Object} filters
     * @returns {Promise<{data: AuditLog[], metadata: Object}>}
     */
    async getLogsByAccountId(accountId, filters = {}) {
        return this.searchLogs({ ...filters, account_id: accountId });
    }
}

module.exports = AuditLogService;