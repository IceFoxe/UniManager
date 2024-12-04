const { Sequelize, DataTypes } = require('sequelize');
const { applyExtraSetup } = require('./AdditionalSetup');

const sequelize = new Sequelize('UniProj', 'Aver', 'pepsi', {
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
  require('../DbModels/Account'),
  require('../DbModels/AuditLog'),
  require('../DbModels/Course'),
  require('../DbModels/Employee'),
  require('../DbModels/Faculty'),
  require('../DbModels/FacultyProgram'),
  require('../DbModels/Grade'),
  require('../DbModels/Professor'),
  require('../DbModels/Program'),
  require('../DbModels/Student')
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
    console.log('All DbModels were synchronized successfully.');

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