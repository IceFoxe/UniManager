const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Professor = sequelize.define('Professor', {
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

module.exports = Professor;