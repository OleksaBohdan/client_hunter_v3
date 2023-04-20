import { Keyword } from '../../databases/mongo/models/Keyword.js';
import { User } from '../../databases/mongo/models/User.js';
import { mapKeyword } from '../../pkg/mappers/keyword.mapper.js';

export async function createKeyword(name: string, userId: string) {
  const user = await User.findById(userId);
  const keyword = await Keyword.create({ keyword: name, user: user });
  return mapKeyword(keyword);
}

export async function readKeywords(id: string) {
  return await Keyword.find({ user: id });
}

export async function deleteKeyword(id: string) {
  return await Keyword.findByIdAndDelete(id);
}
