const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Account', {
        account_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Login cannot be empty'
                },
                len: {
                    args: [3, 50],
                    msg: 'Login must be between 3 and 50 characters'
                },
                is: {
                    args: /^[a-zA-Z0-9_]+$/,
                    msg: 'Login can only contain letters, numbers, and underscores'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'Email address must be valid'
                },
                notEmpty: {
                    msg: 'Email address cannot be empty'
                },
                len: {
                    args: [5, 255],
                    msg: 'Email address must be between 5 and 255 characters'
                }
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Password hash cannot be empty'
                },
                len: {
                    args: [60, 255],
                    msg: 'Password hash must be between 60 and 255 characters'
                }
            }
        },
        first_name: {
            type: DataTypes.STRING(50),
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'First name must be between 2 and 50 characters'
                },
                is: {
                    args: /^[a-zA-Z\s-']+$/,
                    msg: 'First name can only contain letters, spaces, hyphens, and apostrophes'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING(50),
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'Last name must be between 2 and 50 characters'
                },
                is: {
                    args: /^[a-zA-Z\s-']+$/,
                    msg: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
                }
            }
        },
        ssn_hash: {
            type: DataTypes.STRING(255),
            validate: {
                len: {
                    args: [64, 255],
                    msg: 'SSN hash must be between 64 and 255 characters'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('student', 'employee', 'teacher', 'admin'),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['student', 'employee', 'teacher', 'admin']],
                    msg: 'Invalid role selected'
                }
            }
        },
        last_login: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Last login must be a valid date'
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
        tableName: 'accounts',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    });
};