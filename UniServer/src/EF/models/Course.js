module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  const Course = sequelize.define('Course', {
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

})
return Course;
}