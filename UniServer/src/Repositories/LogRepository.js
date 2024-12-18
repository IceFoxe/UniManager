const {Op} = require('sequelize');

class AuditLogRepository {
    constructor(sequelize) {
        this.AuditLog = sequelize.models.AuditLog;
    }

    async create(auditLogData, options = {}) {


        try {
            const createdLog = await this.AuditLog.create({
                account_id: auditLogData.account_id,
                timestamp: auditLogData.timestamp,
                action: auditLogData.action,
                table_name: auditLogData.table_name,
                record_id: auditLogData.record_id,
                old_values: auditLogData.old_values,
                new_values: auditLogData.new_values,
                ip_address: auditLogData.ip_address,
                user_agent: auditLogData.user_agent,
                created_at: auditLogData.created_at
            },{
                transaction: options.transaction
            });

            return createdLog;
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new Error(`Database validation failed: ${error.message}`);
            }
            throw new Error(`Failed to create audit log: ${error.message}`);
        }
    }

    async searchLogs(params) {
        const where = {};

        if (params.account_id) {
            where.account_id = params.account_id;
        }

        if (params.action) {
            where.action = params.action;
        }

        if (params.table_name) {
            where.table_name = params.table_name;
        }

        if (params.start_date || params.end_date) {
            where.timestamp = {};
            if (params.start_date) {
                where.timestamp[Op.gte] = params.start_date;
            }
            if (params.end_date) {
                where.timestamp[Op.lte] = params.end_date;
            }
        }

        const {rows: data, count: total} = await this.AuditLog.findAndCountAll({
            where,
            order: [['timestamp', 'DESC']],
            limit: params.limit,
            offset: (params.page - 1) * params.limit
        });

        return {
            data,
            total,
            page: params.page,
            limit: params.limit
        };
    }

    async findById(id) {
        return this.AuditLog.findByPk(id);
    }
}

module.exports = AuditLogRepository;