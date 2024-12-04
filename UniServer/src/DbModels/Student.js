const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Student', {
        student_id: {
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
        program_id: {  // Changed from faculty_program_id to program_id
            type: DataTypes.INTEGER,
            allowNull: true
        },
        student_number: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Student number is required'
                },
                notEmpty: {
                    msg: 'Student number cannot be empty'
                },
                len: {
                    args: [5, 20],
                    msg: 'Student number must be between 5 and 20 characters'
                },
                is: {
                    args: /^[A-Z0-9-]+$/,
                    msg: 'Student number can only contain uppercase letters, numbers, and hyphens'
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
                    msg: 'Semester must be at least 1'
                },
                max: {
                    args: [12],
                    msg: 'Semester cannot exceed 12'
                }
            }
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive', 'Graduated', 'On Leave', 'Suspended', 'Withdrawn'),
            allowNull: false,
            defaultValue: 'Active',
            validate: {
                isIn: {
                    args: [['Active', 'Inactive', 'Graduated', 'On Leave', 'Suspended', 'Withdrawn']],
                    msg: 'Invalid student status'
                }
            }
        },
        enrollment_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: 'Enrollment date must be a valid date'
                },
                isNotFuture(value) {
                    if (value > new Date()) {
                        throw new Error('Enrollment date cannot be in the future');
                    }
                }
            }
        },
        expected_graduation: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Expected graduation date must be a valid date'
                },
                isAfterEnrollment(value) {
                    if (value && value <= this.enrollment_date) {
                        throw new Error('Expected graduation date must be after enrollment date');
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
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: 'Updated at must be a valid date'
                }
            }
        }
    }, {
        tableName: 'students',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['student_number']
            },
            {
                unique: true,
                fields: ['account_id']
            },
            {
                fields: ['program_id']
            },
            {
                fields: ['status']
            },
            {
                fields: ['semester']
            }
        ],
    });
};