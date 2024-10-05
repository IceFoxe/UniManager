const permissionMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles.includes(requiredRole)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

module.exports = permissionMiddleware;