import { Parser } from '../../databases/mongo/models/Parser.js';
import { User } from '../../databases/mongo/models/User.js';
export async function createParser(name) {
    await Parser.create({ name: name });
}
export async function readParsers() {
    return await Parser.find();
}
export async function readParser(id) {
    return await Parser.findById(id);
}
export async function chooseParser(userId, parserId) {
    try {
        await User.findByIdAndUpdate(userId, { parser: parserId });
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=parser.service.js.map