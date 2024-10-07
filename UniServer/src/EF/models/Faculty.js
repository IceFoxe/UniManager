module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  const Faculty = sequelize.define('Faculty', {
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
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'Faculties',
    timestamps: true,
  });

  Faculty.associate = (models) => {
    // Define associations here
    // For example:
    // Faculty.hasMany(models.Course);
    // Faculty.hasMany(models.Student);
  };

  return Faculty;
};