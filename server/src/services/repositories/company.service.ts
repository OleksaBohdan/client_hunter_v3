import { Company, ICompany } from '../../databases/mongo/models/Company.js';
import { User, IUser } from '../../databases/mongo/models/User.js';
import { Email, IEmail } from '../../databases/mongo/models/Email.js';

export async function createCompany(c: ICompany, u: IUser, e: IEmail[]): Promise<ICompany> {
  const company = new Company(c);
  company.user = u;
  company.sentEmails = e;
  return await company.save();
}

export async function readCompanies(u: IUser): Promise<ICompany[]> {
  const companies = await Company.find({ u });
  return companies;
}

export async function deleteCompany(c: ICompany): Promise<ICompany | null> {
  try {
    return await Company.findByIdAndDelete(c._id);
  } catch (err) {
    throw err;
  }
}
