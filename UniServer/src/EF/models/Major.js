module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  const Major = sequelize.define('Major', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'Majors',
    timestamps: true,
  });

  Major.associate = (models) => {
    //Major.belongsTo(sequelize.models.Faculty, { foreignKey: 'facultyId' });
    //Major.hasMany(sequelize.models.Student);
    //Major.hasMany(sequelize.models.Course);
  };

  return Major;
};