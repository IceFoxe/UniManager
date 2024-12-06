const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Employee', {
        employee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Account ID is required'
                },
                isInt: {
                    msg: 'Account ID must be an integer'
                }
            }
        },
        position: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "User",
            validate: {
                notNull: {
                    msg: 'Position is required'
                },
                notEmpty: {
                    msg: 'Position cannot be empty'
                },
                len: {
                    args: [2, 50],
                    msg: 'Position must be between 2 and 50 characters'
                },
                isIn: {
                    args: [['User', 'Administrator', 'Teacher', 'Professor', 'Department Head', 'Dean', 'Staff']],
                    msg: 'Invalid position specified'
                }
            }
        },
        employment_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                notNull: {
                    msg: 'Employment date is required'
                },
                isDate: {
                    msg: 'Employment date must be a valid date'
                },
                isNotFuture(value) {
                    if (value > new Date()) {
                        throw new Error('Employment date cannot be in the future');
                    }
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
        }
    }, {
        tableName: 'employees',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['account_id']
            },
            {
                fields: ['position']
            },
            {
                fields: ['employment_date']
            }
        ],
    });
};