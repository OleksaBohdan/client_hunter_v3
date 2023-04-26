import { Parser } from '../../databases/mongo/models/Parser.js';
import { User } from '../../databases/mongo/models/User.js';

export async function createParser(name: string) {
  return await Parser.create({ name: name });
}

export async function readParsers() {
  return await Parser.find();
}

export async function readParser(id: string) {
  return await Parser.findById(id);
}

export async function chooseParser(userId: string, parserId: string) {
  return await User.findByIdAndUpdate(userId, { parser: parserId });
}
