const express = require('express');
const authMiddleware = require('./middleware/auth');
const { initializeDatabase } = require('./config/DataBaseConfig');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config({ path: '../.env' });
async function startApp() {
    try {
        await initializeDatabase();

        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors({
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        }));

        const routes = {
            accounts: require('./routes2/Accounts'),
            auditLogs: require('./routes2/AuditLogs'),
            courses: require('./routes2/Courses'),
            employees: require('./routes2/Employees'),
            faculties: require('./routes2/Faculties'),
            grades: require('./routes2/Grades'),
            professors: require('./routes2/Professors'),
            programs: require('./routes2/Programs'),
            students: require('./routes2/Students'),
        };

        function makeHandlerAwareOfAsyncErrors(handler) {
            return async function(req, res, next) {
                try {
                    await handler(req, res);
                } catch (error) {
                    next(error);
                }
            };
        }

        // Define role requirements for each route type
        const roleRequirements = {
            accounts: { read: ['admin'], write: ['admin'] },
            auditLogs: { read: ['admin'], write: ['admin'] },
            courses: { read: ['admin', 'professor', 'student'], write: ['admin', 'professor'] },
            employees: { read: ['admin'], write: ['admin'] },
            faculties: { read: ['admin', 'professor', 'student'], write: ['admin'] },
            grades: { read: ['admin', 'professor', 'student'], write: ['admin', 'professor'] },
            professors: { read: ['admin', 'professor'], write: ['admin'] },
            programs: { read: ['admin', 'professor', 'student'], write: ['admin'] },
            students: { read: ['admin', 'professor'], write: ['admin'] },
        };

        for (const [routeName, routeController] of Object.entries(routes)) {
            const basePath = `/api/${routeName}`;
            const roles = roleRequirements[routeName];

            if (routeController.getAll) {
                app.get(
                    basePath,
                    authMiddleware.auth,
                    authMiddleware.checkPermission(roles.read[0]),
                    makeHandlerAwareOfAsyncErrors(routeController.getAll)
                );
            }

            if (routeController.getById) {
                app.get(
                    `${basePath}/:id`,
                    authMiddleware.auth,
                    authMiddleware.checkPermission(roles.read[0]),
                    makeHandlerAwareOfAsyncErrors(routeController.getById)
                );
            }

            if (routeController.create) {
                app.post(
                    basePath,
                    authMiddleware.auth,
                    authMiddleware.checkPermission(roles.write[0]),
                    makeHandlerAwareOfAsyncErrors(routeController.create)
                );
            }

            if (routeController.update) {
                app.put(
                    `${basePath}/:id`,
                    authMiddleware.auth,
                    authMiddleware.checkPermission(roles.write[0]),
                    makeHandlerAwareOfAsyncErrors(routeController.update)
                );
            }

            if (routeController.remove) {
                app.delete(
                    `${basePath}/:id`,
                    authMiddleware.auth,
                    authMiddleware.checkPermission(roles.write[0]),
                    makeHandlerAwareOfAsyncErrors(routeController.remove)
                );
            }
        }
        app.use('/api/auth', authRoutes);
        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Something went wrong!' });
        });

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    } catch (err) {
        console.error('Failed to start the application:', err);
        process.exit(1);
    }
}

startApp();
