import { IUser } from '../../databases/mongo/models/User.js';

export function mapUserWithoutPassword(user: IUser) {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
