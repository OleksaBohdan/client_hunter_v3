import mongoose, { Document, Schema } from 'mongoose';
import { ICompany } from './Company.js';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  companies: ICompany['_id'][];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, unique: true },
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);
