const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('UniProj', 'aver', 'your_password', {
  host: 'localhost',
  dialect: 'mssql',
});