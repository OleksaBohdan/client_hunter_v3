import { User, IUser } from '../../databases/mongo/models/User.js';
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
