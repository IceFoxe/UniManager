const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Faculty = sequelize.define('Faculty', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
});

module.exports = Faculty;