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
  },
})}