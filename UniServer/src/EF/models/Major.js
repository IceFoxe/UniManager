const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Major = sequelize.define('Major', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Major;