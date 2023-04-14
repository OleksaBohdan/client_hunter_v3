import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.js';
import { IEmail } from './Email.js';

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
    positionKeyword: { type: String, default: '' },
    placeKeyword: { type: String, default: '' },
    mailFrom: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    name: { type: String, default: '' },
    website: { type: String, default: '' },
    vacancyLink: { type: String, default: '' },
    additionalInfo: { type: String, default: '' },
    industry: { type: String, default: '' },
    vacancyTitle: { type: String, default: '' },
    address: { type: String, default: '' },
    size: { type: Number, default: NaN },
    turnover: { type: Number, default: NaN },
    vacancyDate: { type: Date },
    status: { type: String, enum: Object.values(Status), required: true, default: Status.WHITE },
    vacancyParsedDate: { type: Date, required: true, default: Date.now() },
    sentEmails: [{ type: Schema.Types.ObjectId, ref: 'Email' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
