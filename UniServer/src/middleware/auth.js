const {verify} = require("jsonwebtoken");
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        req.user = verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const checkPermission = (requiredRole) => {
    return (req, res, next) => {
        const role = req.user.role.toLowerCase()
        if (!req.user || !requiredRole.includes(role) ) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

module.exports = { auth, checkPermission };