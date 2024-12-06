const { Op } = require('sequelize');

class AuditLogRepository {
    constructor(sequelize) {
        this.AuditLog = sequelize.models.AuditLog;
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

        const { rows: data, count: total } = await this.AuditLog.findAndCountAll({
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