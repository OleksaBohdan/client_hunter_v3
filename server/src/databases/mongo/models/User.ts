import mongoose, { Document, Schema } from 'mongoose';
import { ICompany } from './Company.js';
import { IKeyword } from './Keyword.js';
import { ICity } from './City.js';
import { IBlackIndustry } from './BlackIndustry.js';
import { IParser } from './Parser.js';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  companies: ICompany['_id'][];
  keywords: IKeyword['_id'][];
  cities: ICity['_id'][];
  blackIndustry: IBlackIndustry['_id'][];
  parser: IParser['_id'];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, unique: true },
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
    keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
    cities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
    blackIndustry: [{ type: Schema.Types.ObjectId, ref: 'BlackIndustry' }],
    parser: { type: Schema.Types.ObjectId, ref: 'Parser' },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);
