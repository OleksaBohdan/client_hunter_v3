import { BlackIndustry } from '../../databases/mongo/models/BlackIndustry.js';
import { User } from '../../databases/mongo/models/User.js';
import { mapBlackIndustry } from '../../pkg/mappers/blackIndustry.mapper.js';

export async function createBlackIndustry(name: string, userId: string) {
  const user = await User.findById(userId);
  const blackIndustry = await BlackIndustry.create({ name: name, user: user });
  return mapBlackIndustry(blackIndustry);
}

export async function readBlackIndustries(id: string) {
  return await BlackIndustry.find({ user: id });
}

export async function readBlackIndustry(id: string) {
  return await BlackIndustry.findById(id);
}

export async function deleteBlackIndustry(userId: string, id: string) {
  await BlackIndustry.findByIdAndDelete(id);
}
