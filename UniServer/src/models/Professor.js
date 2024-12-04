const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Professor', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        facultyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Faculty ID is required'
                },
                isInt: {
                    msg: 'Faculty ID must be an integer'
                }
            }
        },
        employee_id: {
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
        academicTitle: {
            type: DataTypes.ENUM('Assistant Professor', 'Associate Professor', 'Full Professor'),
            allowNull: false,
            defaultValue: 'Assistant Professor',
            validate: {
                notNull: {
                    msg: 'Academic title is required'
                },
                isIn: {
                    args: [['Assistant Professor', 'Associate Professor', 'Full Professor']],
                    msg: 'Invalid academic title'
                }
            }
        },
        officeRoom: {
            type: DataTypes.STRING(20),
            validate: {
                len: {
                    args: [1, 20],
                    msg: 'Office room must be between 1 and 20 characters'
                },
                is: {
                    args: /^[A-Z0-9-]+$/,
                    msg: 'Office room can only contain uppercase letters, numbers, and hyphens'
                }
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: 'Created at must be a valid date'
                }
            }
        },

    }, {
        tableName: 'Professors',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['employee_id']
            },
            {
                fields: ['facultyId']
            },
        ],
    });
};