import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/app.config.js';
export async function checkAuth(req, res, next) {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
//# sourceMappingURL=getMe.middleware.js.map