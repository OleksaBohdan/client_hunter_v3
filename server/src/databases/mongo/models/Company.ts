import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.js';
import { IEmail } from './Email.js';
import { v4 as uuidv4 } from 'uuid';

export enum Status {
  WHITE = 'white',
  GREY = 'grey',
  BLACK = 'black',
  REQUEST = 'request',
  PROCESS = 'process',
  REJECT = 'reject',
  SUCCESS = 'success',
}

export interface ICompany extends Document {
  note: string;
  positionKeyword: string;
  placeKeyword: string;
  mailFrom: string;
  email: string;
  phone: string;
  name: string;
  website: string;
  vacancyLink: string;
  additionalInfo: string;
  industry: string;
  vacancyTitle: string;
  address: string;
  size: number;
  turnover: number;
  vacancyDate: Date;
  status: Status;
  vacancyParsedDate: Date;
  sentEmails: IEmail['_id'][];
  user: IUser['_id'];
}

const CompanySchema: Schema<ICompany> = new Schema<ICompany>(
  {
    note: { type: String, default: '' },
    positionKeyword: { type: String, default: '' },
    placeKeyword: { type: String, default: '' },
    mailFrom: { type: String },
    email: { type: String, unique: true, default: () => uuidv4() },
    phone: { type: String },
    name: { type: String },
    website: { type: String },
    vacancyLink: { type: String },
    additionalInfo: { type: String },
    industry: { type: String },
    vacancyTitle: { type: String },
    address: { type: String },
    size: { type: Number },
    turnover: { type: Number },
    vacancyDate: { type: Date },
    status: { type: String, enum: Object.values(Status), required: true, default: Status.WHITE },
    vacancyParsedDate: { type: Date, required: true, default: Date.now() },
    sentEmails: [{ type: Schema.Types.ObjectId, ref: 'Email' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

CompanySchema.index({ email: 1, user: 1 }, { unique: true });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
