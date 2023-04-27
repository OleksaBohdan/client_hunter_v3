import { Keyword } from '../../databases/mongo/models/Keyword.js';
import { User } from '../../databases/mongo/models/User.js';
import { mapKeyword } from '../../pkg/mappers/keyword.mapper.js';
export async function createKeyword(name, userId) {
    const user = await User.findById(userId);
    const keyword = await Keyword.create({ keyword: name, user: user });
    return mapKeyword(keyword);
}
export async function readKeywords(id) {
    return await Keyword.find({ user: id });
}
export async function readKeyword(id) {
    return await Keyword.findById(id);
}
export async function deleteKeyword(userId, id) {
    await Keyword.findByIdAndDelete(id);
    const user = await User.findById(userId);
    if ((user === null || user === void 0 ? void 0 : user.activeKeyword) == id) {
        user.activeKeyword = undefined;
        await user.save();
    }
}
export async function chooseKeyword(userId, keywordId) {
    await User.findByIdAndUpdate(userId, { activeKeyword: keywordId });
}
//# sourceMappingURL=keyword.service.js.map