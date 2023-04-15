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
    console.log(filteredEmails);
    return filteredEmails;
}
//# sourceMappingURL=company.service.js.map