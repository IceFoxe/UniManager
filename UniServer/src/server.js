const express = require('express');
const routes = require('./routes');
const authMiddleware = require('./middleware/auth');
const { initializeDatabase } = require('./config/db');
const cors = require('cors');
const StudentController = require("./EF/controllers/StudentController");
const AccountController = require('./EF/controllers/AccountController');

async function startApp() {
  try {
    await initializeDatabase();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);
    app.use((req, res, next) => {
  console.log(`Received a ${req.method} request to ${req.url}`);
  next();
});

    const router = express.Router();
    router.get('/students', StudentController.getAllStudents);


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error('Failed to start the application:', err);
    process.exit(1);
  }
}

startApp();