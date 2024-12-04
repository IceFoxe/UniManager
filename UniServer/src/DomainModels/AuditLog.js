const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('AuditLog', {
        log_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Account ID must be an integer'
                },
                notNull: {
                    msg: 'Account ID is required'
                }
            }
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Timestamp must be a valid date'
                }
            }
        },
        action: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [1, 100],
                    msg: 'Action must be between 1 and 100 characters'
                },
                isIn: {
                    args: [['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'OTHER']],
                    msg: 'Invalid action type'
                }
            }
        },
        table_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [1, 100],
                    msg: 'Table name must be between 1 and 100 characters'
                },
                is: {
                    args: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                    msg: 'Table name must contain only letters, numbers, and underscores, and start with a letter or underscore'
                }
            }
        },
        record_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Record ID must be an integer'
                }
            }
        },
        old_values: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                isValidJSON(value) {
                    if (value) {
                        try {
                            JSON.parse(value);
                        } catch (e) {
                            throw new Error('Old values must be valid JSON');
                        }
                    }
                }
            }
        },
        new_values: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                isValidJSON(value) {
                    if (value) {
                        try {
                            JSON.parse(value);
                        } catch (e) {
                            throw new Error('New values must be valid JSON');
                        }
                    }
                }
            }
        },
        ip_address: {
            type: DataTypes.STRING(45), // Support for IPv6 addresses
            allowNull: true,
            validate: {
                isIP: {
                    msg: 'Must be a valid IP address'
                }
            }
        },
        user_agent: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'User agent must not exceed 255 characters'
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: 'Created at must be a valid date'
                }
            }
        },
    }, {
        tableName: 'audit_logs',
        timestamps: false,
        indexes: [
            {
                fields: ['account_id']
            },
            {
                fields: ['timestamp']
            },
            {
                fields: ['action']
            },
            {
                fields: ['table_name', 'record_id']
            }
        ]
    });
};