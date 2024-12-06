// models/AuditLog.js

class AuditLog {
    /**
     * @param {Object} data
     * @param {number} [data.log_id]
     * @param {number} data.account_id
     * @param {Date} [data.timestamp]
     * @param {string} [data.action]
     * @param {string} [data.table_name]
     * @param {number} [data.record_id]
     * @param {string} [data.old_values]
     * @param {string} [data.new_values]
     * @param {string} [data.ip_address]
     * @param {string} [data.user_agent]
     * @param {Date} [data.created_at]
     */
    constructor(data) {
        this.log_id = data.log_id;
        this.account_id = data.account_id;
        this.timestamp = data.timestamp || new Date();
        this.action = data.action;
        this.table_name = data.table_name;
        this.record_id = data.record_id;
        this.old_values = data.old_values;
        this.new_values = data.new_values;
        this.ip_address = data.ip_address;
        this.user_agent = data.user_agent;
        this.created_at = data.created_at || new Date();
    }

    /**
     * @readonly
     * @type {string[]}
     */
    static get VALID_ACTIONS() {
        return ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'OTHER'];
    }

    /**
     * @param {string} action
     * @returns {boolean}
     */
    static isValidAction(action) {
        return AuditLog.VALID_ACTIONS.includes(action);
    }

    /**
     * @param {Object} oldValues
     * @param {Object} newValues
     * @returns {boolean}
     */
    hasChanges(oldValues, newValues) {
        return JSON.stringify(oldValues) !== JSON.stringify(newValues);
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            log_id: this.log_id,
            account_id: this.account_id,
            timestamp: this.timestamp,
            action: this.action,
            table_name: this.table_name,
            record_id: this.record_id,
            old_values: this.old_values ? JSON.parse(this.old_values) : null,
            new_values: this.new_values ? JSON.parse(this.new_values) : null,
            ip_address: this.ip_address,
            user_agent: this.user_agent,
            created_at: this.created_at
        };
    }

    /**
     * @returns {string}
     */
    getChangeSummary() {
        if (!this.old_values || !this.new_values) {
            return '';
        }

        const oldObj = JSON.parse(this.old_values);
        const newObj = JSON.parse(this.new_values);
        const changes = [];

        for (const key in newObj) {
            if (oldObj[key] !== newObj[key]) {
                changes.push(`${key}: ${oldObj[key]} → ${newObj[key]}`);
            }
        }

        return changes.join(', ');
    }

    /**
     * @param {Object} data
     * @returns {boolean}
     */
    validate() {
        if (!this.account_id) {
            throw new Error('Account ID is required');
        }

        if (this.action && !AuditLog.isValidAction(this.action)) {
            throw new Error('Invalid action type');
        }

        if (this.old_values) {
            try {
                JSON.parse(this.old_values);
            } catch (e) {
                throw new Error('Invalid old_values JSON format');
            }
        }

        if (this.new_values) {
            try {
                JSON.parse(this.new_values);
            } catch (e) {
                throw new Error('Invalid new_values JSON format');
            }
        }

        return true;
    }
}

module.exports = AuditLog;