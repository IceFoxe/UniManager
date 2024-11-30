const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Grade', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Student ID is required'
                },
                isInt: {
                    msg: 'Student ID must be an integer'
                }
            }
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Group ID is required'
                },
                isInt: {
                    msg: 'Group ID must be an integer'
                }
            }
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Grade value is required'
                },
                isFloat: {
                    msg: 'Grade value must be a number'
                },
                min: {
                    args: [0],
                    msg: 'Grade value cannot be negative'
                },
                max: {
                    args: [100],
                    msg: 'Grade value cannot exceed 100'
                }
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: 'Invalid date format'
                },
                notInFuture(value) {
                    if (value > new Date()) {
                        throw new Error('Grade date cannot be in the future');
                    }
                }
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Grades',
        timestamps: true,
        indexes: [
            {
                fields: ['student_id']
            },
            {
                fields: ['group_id']
            },
            {
                fields: ['date']
            }
        ]
    });
};