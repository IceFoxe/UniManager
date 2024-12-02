const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');  // Direct import from sequelize
const { models } = require('../config/db');
class AuthController {
        async login(req, res) {
        const { login, password } = req.body;
        const SaltPassword = await bcrypt.hash(password, 10);

        if (!login || !password) {
            return res.status(400).json({
                error: 'Please provide both login and password'
            });
        }

        try {
            const account = await models.Account.findOne({
                where: Sequelize.literal(`(login = '${login}' OR email = '${login}')`)
            });

            if (!account) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            const isValidPassword = await bcrypt.compare(password, account.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            await account.update({
                last_login: new Date()
            });

            const token = jwt.sign(
                {
                    userId: account.account_id,
                    login: account.login,
                    email: account.email,
                    role: account.role,
                    firstName: account.first_name,
                    lastName: account.last_name
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            // Return success response
            res.json({
                message: 'Login successful',
                token,
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'An error occurred during login'
            });
        }
    }

    async register(req, res) {
        const {
            login,
            email,
            password,
            firstName,
            lastName,
            ssn,
            role
        } = req.body;

        try {
            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Hash SSN if provided
            let ssnHash = null;
            if (ssn) {
                ssnHash = await bcrypt.hash(ssn, 10);
            }

            // Create new account
            const account = await models.Account.create({
                login,
                email,
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                ssn_hash: ssnHash,
                role,
                created_at: new Date()
            });

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: account.account_id,
                    login: account.login,
                    email: account.email,
                    role: account.role,
                    firstName: account.first_name,
                    lastName: account.last_name
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Account created successfully',
                token,
                user: {
                    id: account.account_id,
                    login: account.login,
                    email: account.email,
                    role: account.role,
                    firstName: account.first_name,
                    lastName: account.last_name
                }
            });

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    error: 'Login or email already exists'
                });
            }

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    error: error.errors.map(e => e.message)
                });
            }

            console.error('Registration error:', error);
            res.status(500).json({
                error: 'An error occurred during registration'
            });
        }
    }
}

module.exports = new AuthController();