import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.js';
import { ICompany } from './Company.js';

export interface IEmail extends Document {
  title: string;
  content: string;
  companies: ICompany['_id'][];
  user: IUser['_id'];
}

const EmailSchema: Schema = new Schema<IEmail>({
  title: { type: String },
  content: { type: String, required: true },
  companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Email = mongoose.model<IEmail>('Email', EmailSchema);
