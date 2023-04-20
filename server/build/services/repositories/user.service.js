import { User } from '../../databases/mongo/models/User.js';
import bcrypt from 'bcrypt';
import { mapUserWithoutPassword } from '../../pkg/mappers/user.mapper.js';
export async function createUser(u) {
    try {
        const user = new User(u);
        return await user.save();
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
export async function readUser(email) {
    try {
        const user = await User.findOne({ email: email });
        return user;
    }
    catch (err) {
        throw err;
    }
}
export async function updateUser(id, password, newEmail) {
    try {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        const user = await User.findByIdAndUpdate(id, { email: newEmail, passwordHash: hash }, { new: true });
        if (user) {
            return mapUserWithoutPassword(user);
        }
    }
    catch (err) {
        throw err;
    }
}
export async function deleteUser(id) {
    try {
        const user = await User.findByIdAndDelete(id);
        return user;
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=user.service.js.map