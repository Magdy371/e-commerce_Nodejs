import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError('Unauthorized: No token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.sub, role: decoded.role }; // role must be added to token at login
        next();
    } catch (err) {
        return next(new ApiError('Unauthorized: Invalid token', 401));
    }
};

export default authMiddleware;
