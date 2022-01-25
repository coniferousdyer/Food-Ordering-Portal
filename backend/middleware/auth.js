const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                error: "No token provided, authorization denied",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                error: "Invalid token, authorization denied",
            });
        }

        req.user = decoded.id;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: "Token expired, authorization denied",
            });
        }
        
        res.status(500).json({
            error: err
        });
    }
}

module.exports = auth;