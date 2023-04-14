import { User, IUser } from '../../databases/mongo/models/User.js';
import { Company, ICompany } from '../../databases/mongo/models/Company.js';

export async function createUser(u: IUser): Promise<IUser> {
  try {
    const user = new User(u);
    return await user.save();
  } catch (err) {
    throw err;
  }
}
