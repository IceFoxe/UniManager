const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Program', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Program name is required'
                },
                notEmpty: {
                    msg: 'Program name cannot be empty'
                },
                len: {
                    args: [2, 50],
                    msg: 'Program name must be between 2 and 50 characters'
                },
                is: {
                    args: /^[a-zA-Z0-9\s&()-]+$/,
                    msg: 'Program name can only contain letters, numbers, spaces, ampersands, parentheses, and hyphens'
                }
            }
        },
        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Program code is required'
                },
                notEmpty: {
                    msg: 'Program code cannot be empty'
                },
                len: {
                    args: [2, 10],
                    msg: 'Program code must be between 2 and 10 characters'
                },
                is: {
                    args: /^[A-Z0-9]+$/,
                    msg: 'Program code can only contain uppercase letters and numbers'
                }
            }
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
        description: {
            type: DataTypes.TEXT,
            validate: {
                len: {
                    args: [0, 1000],
                    msg: 'Description cannot exceed 1000 characters'
                }
            }
        },
        degreeLevel: {
            type: DataTypes.ENUM('Associate', 'Bachelor', 'Master', 'Doctorate'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Degree level is required'
                },
                isIn: {
                    args: [['Associate', 'Bachelor', 'Master', 'Doctorate']],
                    msg: 'Invalid degree level'
                }
            }
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 4,
            validate: {
                isInt: {
                    msg: 'Duration must be an integer'
                },
                min: {
                    args: [1],
                    msg: 'Duration must be at least 1 year'
                },
                max: {
                    args: [8],
                    msg: 'Duration cannot exceed 8 years'
                }
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    }, {
        tableName: 'Programs',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['code']
            },
            {
                fields: ['facultyId']
            },
            {
                fields: ['name']
            },
            {
                fields: ['degreeLevel']
            }
        ],

    });
};