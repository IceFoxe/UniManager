module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  const Professor = sequelize.define('Professor', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'Professors',
    timestamps: true,
  });

  Professor.associate = (models) => {
    // Define associations here
    //Professor.belongsTo(sequelize.models.Account, { foreignKey: 'accountId' });
    //Professor.belongsTo(sequelize.models.Faculty, { foreignKey: 'facultyId' });
    //Professor.belongsToMany(sequelize.models.Course, { through: 'ProfessorCourses' });
  };

  return Professor;
};