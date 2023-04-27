import { Parser } from '../../databases/mongo/models/Parser.js';
import { User } from '../../databases/mongo/models/User.js';
export async function createParser(name) {
    return await Parser.create({ name: name });
}
export async function readParsers() {
    return await Parser.find();
}
export async function readParser(id) {
    return await Parser.findById(id);
}
export async function chooseParser(userId, parserId) {
    return await User.findByIdAndUpdate(userId, { parser: parserId });
}
//# sourceMappingURL=parser.service.js.map