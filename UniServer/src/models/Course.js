const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Course', {
        course_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        faculty_program_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Faculty program ID is required'
                },
                isInt: {
                    msg: 'Faculty program ID must be an integer'
                }
            }
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Teacher ID is required'
                },
                isInt: {
                    msg: 'Teacher ID must be an integer'
                }
            }
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Course name is required'
                },
                notEmpty: {
                    msg: 'Course name cannot be empty'
                },
                len: {
                    args: [2, 100],
                    msg: 'Course name must be between 2 and 100 characters'
                }
            }
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Course code is required'
                },
                notEmpty: {
                    msg: 'Course code cannot be empty'
                },
                len: {
                    args: [2, 20],
                    msg: 'Course code must be between 2 and 20 characters'
                },
                is: {
                    args: /^[A-Z0-9-]+$/,
                    msg: 'Course code can only contain uppercase letters, numbers, and hyphens'
                }
            }
        },
        credits: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Credits must be an integer'
                },
                min: {
                    args: [0],
                    msg: 'Credits cannot be negative'
                },
                max: {
                    args: [30],
                    msg: 'Credits cannot exceed 30'
                }
            }
        },
        semester: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Semester must be an integer'
                },
                min: {
                    args: [1],
                    msg: 'Semester must be 1 or greater'
                },
                max: {
                    args: [12],
                    msg: 'Semester cannot exceed 12'
                }
            }
        },
        mandatory: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                isBoolean(value) {
                    if (typeof value !== 'boolean') {
                        throw new Error('Mandatory field must be true or false');
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
        },
    }, {
        tableName: 'courses',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['code']
            },
            {
                fields: ['faculty_program_id']
            },
            {
                fields: ['teacher_id']
            },
            {
                fields: ['semester']
            }
        ]
    });
};