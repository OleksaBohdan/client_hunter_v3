import mongoose, { Document, Schema } from 'mongoose';
import { ICompany } from './Company.js';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  companies: ICompany['_id'][];
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, unique: true },
  companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
});

export const User = mongoose.model<IUser>('User', UserSchema);
