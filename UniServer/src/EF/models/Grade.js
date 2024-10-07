module.exports = (sequelize, DataTypes) => {
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
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        if (typeof models === 'object' && models !== null) {
            if ('Student' in models && typeof models.Student.prototype === 'object') {
                Grade.belongsTo(models.Student, { foreignKey: 'student_id' });
            }
            if ('Group' in models && typeof models.Group.prototype === 'object') {
                Grade.belongsTo(models.Group, { foreignKey: 'group_id' });
            }
        }
    };
    return Grade;

};

