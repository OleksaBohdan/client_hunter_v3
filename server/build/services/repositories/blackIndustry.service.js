import { BlackIndustry } from '../../databases/mongo/models/BlackIndustry.js';
import { User } from '../../databases/mongo/models/User.js';
import { mapBlackIndustry } from '../../pkg/mappers/blackIndustry.mapper.js';
export async function createBlackIndustry(name, userId) {
    const user = await User.findById(userId);
    const blackIndustry = await BlackIndustry.create({ name: name, user: user });
    return mapBlackIndustry(blackIndustry);
}
export async function readBlackIndustries(id) {
    return await BlackIndustry.find({ user: id });
}
export async function readBlackIndustry(id) {
    return await BlackIndustry.findById(id);
}
export async function deleteBlackIndustry(userId, id) {
    await BlackIndustry.findByIdAndDelete(id);
}
//# sourceMappingURL=blackIndustry.service.js.map