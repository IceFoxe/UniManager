const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('FacultyProgram', {
        faculty_program_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        faculty_id: {
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
        program_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Program ID is required'
                },
                isInt: {
                    msg: 'Program ID must be an integer'
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: 'Created at must be a valid date'
                }
            }
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            validate: {
                notNull: {
                    msg: 'Active status is required'
                }
            }
        }
    }, {
        tableName: 'facultyPrograms',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['faculty_id', 'program_id'],
                name: 'unique_faculty_program'
            }
        ],
    });
};