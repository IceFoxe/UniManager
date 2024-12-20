const express = require('express');
const authMiddleware = require('./middleware/auth');
const {initializeDatabase, sequelize} = require('./Config/DataBaseConfig');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({path: '../.env'});

const authRoutes = require('./routes/AuthRoutes');
const studentRoutes = require('./routes/StudentRoutes')(sequelize);
const facultyRoutes = require('./routes/FacultyRoutes')(sequelize);
const programRoutes = require('./routes/ProgramRoutes')(sequelize);
const employeeRoutes = require('./routes/EmployeeRoutes')(sequelize);
const courseRoutes = require('./routes/CourseRoutes')(sequelize);
const logRoutes = require('./routes/LogRoutes')(sequelize);
const professorRoutes = require('./routes/ProfessorRoutes')(sequelize);
const gradeRoutes = require('./routes/GradeRoutes')(sequelize);

async function startApp() {
    try {
        await initializeDatabase();

        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(cors({
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        }));

        app.use('/api/students', studentRoutes);
        app.use('/api/programs', programRoutes);
        app.use('/api/faculties', facultyRoutes);
        app.use('/api/logs', logRoutes);
        app.use('/api/professors', professorRoutes);
        app.use('/api/grades', gradeRoutes);
        app.use('/api/employees', employeeRoutes);
        app.use('/api/courses', courseRoutes);
        app.use('/api/auth', authRoutes);
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({error: 'Something went wrong!'});
        });
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    } catch (err) {
        console.error('Failed to start the application:', err);
        process.exit(1);
    }
}

startApp();
