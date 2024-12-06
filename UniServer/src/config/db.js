const { Sequelize, DataTypes } = require('sequelize');
const { applyExtraSetup } = require('./AdditionalSetup');

const sequelize = new Sequelize('UniProject', 'aver', 'pepsi', {
  host: 'localhost',
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  }
});

const modelDefiners = [
  require('../models/Account'),
  require('../models/AuditLog'),
  require('../models/Course'),
  require('../models/Employee'),
  require('../models/Faculty'),
  require('../models/FacultyProgram'),
  require('../models/Grade'),
  require('../models/Professor'),
  require('../models/Program'),
  require('../models/Student')
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  models: sequelize.models,
  sequelize,
  initializeDatabase
};