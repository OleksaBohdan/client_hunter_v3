import { Parser } from '../../databases/mongo/models/Parser.js';

export async function createParser(name: string) {
  await Parser.create({ name: name });
}

export async function readParsers() {
  return await Parser.find();
}
