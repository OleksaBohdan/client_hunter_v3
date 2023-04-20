import { readUser, createUser } from '../repositories/user.service.js';
import HttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../../databases/mongo/models/User.js';
import { mapUserWithoutPassword } from '../../pkg/mappers/user.mapper.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../configs/app.config.js';
export async function registerUser(email, password) {
    try {
        const isUsed = await readUser(email);
        if (isUsed) {
            throw HttpError(409, 'Email already in use');
        }
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        const user = new User({ email, passwordHash: hash });
        const newUser = await createUser(user);
        return mapUserWithoutPassword(newUser);
    }
    catch (err) {
        throw err;
    }
}
export async function loginUser(email, password) {
    try {
        const user = await readUser(email);
        if (!user) {
            throw HttpError(404, 'User does not exist');
        }
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            throw HttpError(401, 'Incorrect password');
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email,
        }, JWT_SECRET, { expiresIn: '30d' });
        const authUser = mapUserWithoutPassword(user);
        return { authUser, token, message: 'Authorization successful' };
    }
    catch (err) {
        throw err;
    }
}
export async function getMe() {
    throw HttpError(403, 'Not access');
}
//# sourceMappingURL=auth.service.js.map