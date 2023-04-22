import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.js';

export interface IKeyword extends Document {
  keyword: string;
  user: IUser['_id'];
}

const KeywordSchema: Schema = new Schema<IKeyword>(
  {
    keyword: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

KeywordSchema.index({ keyword: 1, user: 1 }, { unique: true });

export const Keyword = mongoose.model<IKeyword>('Keyword', KeywordSchema);
