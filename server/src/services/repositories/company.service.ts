import { Company, ICompany, Status } from '../../databases/mongo/models/Company.js';
import { IUser } from '../../databases/mongo/models/User.js';

export async function createCompany(c: ICompany, u: IUser): Promise<ICompany> {
  const company = new Company(c);
  company.user = u;
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

export async function readCompaniesVacancyLink(u: IUser): Promise<string[]> {
  const companies: ICompany[] = await Company.find({ user: u });
  const vacancyLinks: string[] = companies.map((company) => company.vacancyLink);
  return vacancyLinks;
}

export async function readCompaniesEmails(u: IUser): Promise<string[]> {
  const companies: ICompany[] = await Company.find({ user: u });
  const emails: string[] = companies.map((company) => company.email);
  const filteredEmails: string[] = emails.filter((email) => email !== '' && email !== undefined);
  return filteredEmails;
}

export async function readAllCompanies(u: IUser) {
  const companies: ICompany[] = await Company.find({ user: u });
  return companies;
}

export async function readCompaniesByStatus(u: IUser, status: string) {
  if (status === 'all') {
    const companies: ICompany[] = await Company.find({ user: u._id });
    return companies;
  }
  const companies: ICompany[] = await Company.find({ user: u._id, status: status });
  return companies;
}

export async function updateCompanyStatus(u: IUser, status: Status, companyNames: string[]): Promise<void> {
  const companiesToUpdate = await Company.find({ name: { $in: companyNames }, user: u });
  await Promise.all(
    companiesToUpdate.map(async (company) => {
      company.status = status;
      await company.save();
    }),
  );
}

export async function deleteCompanies(companyNames: string[]): Promise<void> {
  await Company.deleteMany({ name: { $in: companyNames } });
}
