import { User } from '../../databases/mongo/models/User.js';
import bcrypt from 'bcrypt';
import { mapUserWithoutPassword } from '../../pkg/mappers/user.mapper.js';
export async function createUser(u) {
    const user = new User(u);
    return await user.save();
}
export async function readUser(email) {
    const user = await User.findOne({ email: email });
    return user;
}
export async function readUserById(id) {
    const user = await User.findById(id);
    return user;
}
export async function updateUser(id, password, newEmail) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    const user = await User.findByIdAndUpdate(id, { email: newEmail, passwordHash: hash }, { new: true });
    if (user) {
        return mapUserWithoutPassword(user);
    }
}
export async function deleteUser(id) {
    await User.findByIdAndDelete(id);
}
//# sourceMappingURL=user.service.js.map