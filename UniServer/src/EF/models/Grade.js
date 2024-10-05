const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Grade = sequelize.define('Grade', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});