import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.js';

export interface ICity extends Document {
  city: string;
  user: IUser['_id'];
}

const CitySchema: Schema = new Schema<ICity>(
  {
    city: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

CitySchema.index({ city: 1, user: 1 }, { unique: true });

export const City = mongoose.model<ICity>('City', CitySchema);
