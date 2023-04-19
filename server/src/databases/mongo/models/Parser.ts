import mongoose, { Document, Schema } from 'mongoose';

export interface IParser extends Document {
  name: string;
}

const ParserSchema: Schema = new Schema<IParser>(
  {
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  },
);

export const Parser = mongoose.model<IParser>('Parser', ParserSchema);
