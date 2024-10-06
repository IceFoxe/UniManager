const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Initialize Sequelize instance for SQL Server using username and password
const sequelize = new Sequelize('UniProj', 'Aver', 'pepsi', {  // Replace 'your_password' with the actual password
  dialect: 'mssql',
  dialectOptions: {
    options: {
      enableArithAbort: true,  // Prevents arithmetic overflow errors in certain cases
      encrypt: false,
      trustServerCertificate: true// Optional: set to true if your database connection requires encryption
    }
  },
  host: 'localhost',  // Replace with your SQL Server address if it's not on the local machine
  port: 1433,         // Default SQL Server port
  logging: false      // Optional: disable logging for cleaner output
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to SQL Server has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const models = {};

// Read all files in the models directory
const modelsDir = path.join(__dirname, '../EF/models');
fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(modelsDir, file))(sequelize);
    models[model.name] = model;
  });

// Set up associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true }); // Be careful with this in production
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  models,
  initializeDatabase
};
