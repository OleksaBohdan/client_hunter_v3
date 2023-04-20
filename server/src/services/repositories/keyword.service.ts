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

export async function readKeyword(id: string) {
  return await Keyword.findById(id);
}

export async function deleteKeyword(userId: string, id: string) {
  await Keyword.findByIdAndDelete(id);
  const user = await User.findById(userId);

  if (user?.activeKeyword == id) {
    user.activeKeyword = null;
    await user.save();
  }
}

export async function chooseKeyword(userId: string, keywordId: string) {
  await User.findByIdAndUpdate(userId, { activeKeyword: keywordId });
}
