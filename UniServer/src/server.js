const express = require('express');
const { sequelize } = require('./config/db');
const routes = require('./routes');


const app = express();
const port = process.env.PORT || 3000;
const Student = require('./EF/models/Student');
const Faculty = require('./EF/models/Faculty');

Faculty.hasMany(Student);
Student.belongsTo(Faculty);
app.use(express.json());
app.use('/api', routes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});