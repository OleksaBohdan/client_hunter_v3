import { Company } from '../../databases/mongo/models/Company.js';
export async function createCompany(c, u) {
    const company = new Company(c);
    company.user = u;
    return await company.save();
}
export async function readCompanies(u) {
    const companies = await Company.find({ u });
    return companies;
}
export async function deleteCompany(c) {
    try {
        return await Company.findByIdAndDelete(c._id);
    }
    catch (err) {
        throw err;
    }
}
export async function readCompaniesVacancyLink(u) {
    const companies = await Company.find({ user: u });
    const vacancyLinks = companies.map((company) => company.vacancyLink);
    return vacancyLinks;
}
export async function readCompaniesEmails(u) {
    const companies = await Company.find({ user: u });
    const emails = companies.map((company) => company.email);
    const filteredEmails = emails.filter((email) => email !== '' && email !== undefined);
    return filteredEmails;
}
export async function readAllCompanies(u) {
    const companies = await Company.find({ user: u });
    return companies;
}
export async function readCompaniesByStatus(u, status) {
    if (status === 'all') {
        const companies = await Company.find({ user: u._id });
        return companies;
    }
    const companies = await Company.find({ user: u._id, status: status });
    return companies;
}
export async function updateCompanyStatus(status, companyNames) {
    const companiesToUpdate = await Company.find({ name: { $in: companyNames } });
    await Promise.all(companiesToUpdate.map(async (company) => {
        company.status = status;
        await company.save();
    }));
}
export async function deleteCompanies(companyNames) {
    await Company.deleteMany({ name: { $in: companyNames } });
}
//# sourceMappingURL=company.service.js.map