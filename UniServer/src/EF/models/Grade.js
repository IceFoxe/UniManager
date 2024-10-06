module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Grade = sequelize.define('Grade', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students',
                key: 'id',
            },
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Groups',
                key: 'id',
            },
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
    }, {
        tableName: 'Grades',
        timestamps: true,
    });

    Grade.associate = (models) => {
        // Define associations here, for example:
        Grade.belongsTo(models.Student, { foreignKey: 'student_id' });
        Grade.belongsTo(models.Group, { foreignKey: 'group_id' });
    };

    return Grade;
};