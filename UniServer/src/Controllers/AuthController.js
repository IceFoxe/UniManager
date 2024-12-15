const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const { models } = require('../Config/DataBaseConfig');

class AuthController {
    generateTokens = (userData) => {
        const accessToken = jwt.sign(
            userData,
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            {
                userId: userData.userId,
                version: userData.version || Date.now(),
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    login = async (req, res) => {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide both login and password'
            });
        }

        try {
            const account = await models.Account.findOne({
                where: Sequelize.literal(`(login = '${login}' OR email = '${login}')`)
            });

            if (!account) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            const isValidPassword = await bcrypt.compare(password, account.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            const userData = {
                userId: account.account_id,
                login: account.login,
                email: account.email,
                role: account.role,
                firstName: account.first_name,
                lastName: account.last_name,
                version: Date.now()
            };

            const { accessToken, refreshToken } = this.generateTokens(userData);

            await account.update({
                last_login: new Date()
            });

            res.json({
                status: 'success',
                data: {
                    accessToken,
                    refreshToken,
                    user: {
                        id: account.account_id,
                        login: account.login,
                        email: account.email,
                        role: account.role,
                        firstName: account.first_name,
                        lastName: account.last_name
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                status: 'error',
                message: 'An error occurred during login'
            });
        }
    }

    register = async (req, res) => {
        const {
            login,
            email,
            password,
            firstName,
            lastName,
            ssn,
            role
        } = req.body;

        if (!login || !email || !password || !firstName || !lastName || !role) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields'
            });
        }

        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const ssnHash = ssn ? await bcrypt.hash(ssn, 10) : null;

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

            const userData = {
                userId: account.account_id,
                login: account.login,
                email: account.email,
                role: account.role,
                firstName: account.first_name,
                lastName: account.last_name,
                version: Date.now()
            };

            const { accessToken, refreshToken } = this.generateTokens(userData);

            res.status(201).json({
                status: 'success',
                data: {
                    accessToken,
                    refreshToken,
                    user: {
                        id: account.account_id,
                        login: account.login,
                        email: account.email,
                        role: account.role,
                        firstName: account.first_name,
                        lastName: account.last_name
                    }
                }
            });

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Login or email already exists'
                });
            }

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    status: 'error',
                    message: error.errors.map(e => e.message)
                });
            }

            console.error('Registration error:', error);
            res.status(500).json({
                status: 'error',
                message: 'An error occurred during registration'
            });
        }
    }

    refresh = async (req, res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                status: 'error',
                message: 'Refresh token is required'
            });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            const account = await models.Account.findByPk(decoded.userId);
            if (!account) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            const userData = {
                userId: account.account_id,
                login: account.login,
                email: account.email,
                role: account.role,
                firstName: account.first_name,
                lastName: account.last_name,
                version: decoded.version // Maintain the version from the refresh token
            };

            const tokens = this.generateTokens(userData);

            res.json({
                status: 'success',
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    user: {
                        id: account.account_id,
                        login: account.login,
                        email: account.email,
                        role: account.role,
                        firstName: account.first_name,
                        lastName: account.last_name
                    }
                }
            });

        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Refresh token has expired, please login again',
                    code: 'TOKEN_EXPIRED'
                });
            }

            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid refresh token',
                    code: 'INVALID_TOKEN'
                });
            }

            console.error('Refresh token error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'An error occurred while refreshing tokens'
            });
        }
    }
}

module.exports = new AuthController();