import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.js';

export interface IBlackIndustry extends Document {
  name: string;
  user: IUser['_id'];
}

const BlackIndustrySchema: Schema = new Schema<IBlackIndustry>(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

BlackIndustrySchema.index({ name: 1, user: 1 }, { unique: true });

export const BlackIndustry = mongoose.model<IBlackIndustry>('BlackIndustry', BlackIndustrySchema);
