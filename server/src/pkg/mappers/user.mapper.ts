import { IUser } from '../../databases/mongo/models/User.js';

export function mapUserWithoutPassword(user: IUser) {
  const mappedUser = {
    _id: user.id,
    email: user.email,
    companies: user.companies,
  };
  return mappedUser;
}
