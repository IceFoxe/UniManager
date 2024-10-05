const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  studentNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  majorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    foreignKey: true,
  },
});

module.exports = Student;