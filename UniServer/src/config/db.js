const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

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

const models = {};

const modelsDir = path.join(__dirname, '../EF/models');
fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const modelModule = require(path.join(modelsDir, file));
    const model = modelModule.default || modelModule;
    if (typeof model === 'function') {
      const modelInstance = model(sequelize, DataTypes);
      models[modelInstance.name] = modelInstance;
    } else {
      console.warn(`Model file ${file} does not export a function.`);
    }
  });

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.models.Student.sync();
    console.log('STUDENT models were synchronized successfully.');
    // Sync all models
    await sequelize.sync();

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  models,
  initializeDatabase
};