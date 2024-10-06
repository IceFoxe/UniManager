const express = require('express');
const { sequelize } = require('./config/db');
const routes = require('./routes');
const authMiddleware = require('./middleware/auth');
const { initializeDatabase } = require('./config/db');
async function startApp() {
  try {
    const { sequelize, models } = await initializeDatabase();
    // Start your Express server or other app logic here
  } catch (err) {
    console.error('Failed to start the application:', err);
    process.exit(1);
  }
}

startApp();

const app = express();
const port = process.env.PORT || 3000;
const Student = require('./EF/models/Student');
const Faculty = require('./EF/models/Faculty');
const Account = require('./EF/models/Account');
const Professor = require('./EF/models/Professor');

Account.hasOne(Student, { foreignKey: 'accountId' });
Student.belongsTo(Account, { foreignKey: 'accountId' });
Account.hasOne(Professor, { foreignKey: 'accountId' });
Professor.belongsTo(Account, { foreignKey: 'accountId' });
Faculty.hasMany(Student);
Student.belongsTo(Faculty);

app.use(express.json());
app.use(authMiddleware);
app.use('/api', routes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});