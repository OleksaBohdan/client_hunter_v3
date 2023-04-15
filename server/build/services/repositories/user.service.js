import { User } from '../../databases/mongo/models/User.js';
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
//# sourceMappingURL=user.service.js.map