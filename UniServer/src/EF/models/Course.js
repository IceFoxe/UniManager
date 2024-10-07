module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'Courses',
    timestamps: true,
  });

  Course.associate = (models) => {
    // Define associations here
    // For example:
    // Course.belongsTo(models.Faculty);
    // Course.belongsToMany(models.Student, { through: 'StudentCourses' });
  };

  return Course;
};