import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.js';
import { IEmail } from './Email.js';

export type Status = 'white' | 'grey' | 'black' | 'request' | 'process' | 'reject' | 'success';

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

const CompanySchema: Schema = new Schema<ICompany>({});

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
