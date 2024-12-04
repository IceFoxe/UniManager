const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Faculty', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Faculty name is required'
                },
                notEmpty: {
                    msg: 'Faculty name cannot be empty'
                },
                len: {
                    args: [2, 100],
                    msg: 'Faculty name must be between 2 and 100 characters'
                },
                is: {
                    args: /^[a-zA-Z0-9\s,\-&()]+$/,
                    msg: 'Faculty name can only contain letters, numbers, spaces, commas, hyphens, ampersands, and parentheses'
                }
            }
        },
        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Faculty code is required'
                },
                notEmpty: {
                    msg: 'Faculty code cannot be empty'
                },
                len: {
                    args: [2, 10],
                    msg: 'Faculty code must be between 2 and 10 characters'
                },
                is: {
                    args: /^[A-Z0-9]+$/,
                    msg: 'Faculty code can only contain uppercase letters and numbers'
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
        tableName: 'Faculties',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['code']
            },
            {
                fields: ['name']
            }
        ]
    });
};