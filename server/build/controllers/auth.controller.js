import { registerUser, loginUser } from '../services/auth/auth.service.js';
import HttpError from 'http-errors';
import { User } from '../databases/mongo/models/User.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/app.config.js';
export async function register(req, res, next) {
    try {
        const { email, password } = req.body;
        const newUser = await registerUser(email, password);
        res.status(201).json({ newUser, message: 'Registration completed successfully' });
    }
    catch (err) {
        next(err);
    }
}
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        await loginUser(email, password);
        res.status(200).json(await loginUser(email, password));
    }
    catch (err) {
        next(err);
    }
}
export async function getMe(req, res, next) {
    try {
        res.status(200).json({ message: 'me' });
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                throw HttpError(404, 'User does not exist');
            }
            const token = jwt.sign({
                id: user._id,
                email: user === null || user === void 0 ? void 0 : user.email,
            }, JWT_SECRET, { expiresIn: '30d' });
            res.json({ user, token });
        }
        catch (err) {
            throw err;
        }
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=auth.controller.js.map