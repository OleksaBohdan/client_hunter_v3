import { User, IUser } from '../../databases/mongo/models/User.js';
import bcrypt from 'bcrypt';
import { Company, ICompany } from '../../databases/mongo/models/Company.js';

export async function createUser(u: IUser): Promise<IUser> {
  try {
    const user = new User(u);
    return await user.save();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function readUser(email: string) {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    throw err;
  }
}

export async function updateUser(id: string, password: string, newEmail: string) {
  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    const user = await User.findByIdAndUpdate(id, { email: newEmail, passwordHash: hash }, { new: true });
    return user;
  } catch (err) {
    throw err;
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await User.findByIdAndDelete(id);
    return user;
  } catch (err) {
    throw err;
  }
}
