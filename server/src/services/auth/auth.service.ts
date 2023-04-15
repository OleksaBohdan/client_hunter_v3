import { readUser, createUser } from '../repositories/user.service.js';
import HttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../../databases/mongo/models/User.js';
import { mapUserWithoutPassword } from '../../pkg/mappers/user.mapper.js';

export async function registerUser(email: string, password: string) {
  try {
    const isUsed = await readUser(email);
    if (isUsed) {
      throw HttpError(409, 'Email already in use');
    }
    console.log('im here 1');
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    console.log('im here 2');
    const user = new User({ email, passwordHash: hash });
    console.log(user);
    const newUser = await createUser(user);

    return mapUserWithoutPassword(newUser);
  } catch (err) {
    throw err;
  }
}

export async function login() {
  return;
}

export async function getMe() {
  return;
}
