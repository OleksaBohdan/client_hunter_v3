import HttpError from 'http-errors';
import { readAllCompanies } from '../services/repositories/company.service.js';
import { readUserById } from '../services/repositories/user.service.js';
import { Status } from '../databases/mongo/models/Company.js';
import { createObjectCsvWriter } from 'csv-writer';
import { readCompaniesByStatus } from '../services/repositories/company.service.js';
import { deleteCompanies } from '../services/repositories/company.service.js';
import { checkEmail } from '../pkg/checkEmail.js';
import path from 'path';
export async function readCompanies(req, res, next) {
    try {
        const id = req.userId;
        if (!id) {
            throw HttpError(401, 'Unauthorized');
        }
        const user = await readUserById(id);
        if (!user) {
            throw HttpError(404, 'User does not exist');
        }
        const allCompanies = await readAllCompanies(user);
        const companiesListCount = countCompaniesByStatus(allCompanies, user);
        res.status(200).json({ companiesListCount, message: 'ok' });
    }
    catch (err) {
        next(err);
    }
}
export async function deleteCompaniesByName(req, res, next) {
    try {
        const id = req.userId;
        const { companies } = req.body;
        if (!id) {
            throw HttpError(401, 'Unauthorized');
        }
        const user = await readUserById(id);
        if (!user) {
            throw HttpError(404, 'User does not exist');
        }
        await deleteCompanies(companies);
        res.status(204).json({ message: 'ok' });
    }
    catch (err) {
        next(err);
    }
}
export async function downloadCompany(req, res, next) {
    try {
        const id = req.userId;
        const status = req.params.status;
        if (!id) {
            throw HttpError(401, 'Unauthorized');
        }
        const user = await readUserById(id);
        if (!user) {
            throw HttpError(404, 'User does not exist');
        }
        const companies = await readCompaniesByStatus(user, status);
        const dirName = path.dirname(new URL(import.meta.url).pathname);
        const filePath = path.join(dirName, 'companies.csv');
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'note', title: 'Note' },
                { id: 'sentEmails', title: 'Marketing email IDs' },
                { id: 'name', title: 'Company Name' },
                { id: 'email', title: 'Email Address' },
                { id: 'phone', title: 'Phone Number' },
                { id: 'status', title: 'Status' },
                { id: 'positionKeyword', title: 'Position keyword' },
                { id: 'placeKeyword', title: 'City' },
                { id: 'industry', title: 'Industry' },
                { id: 'address', title: 'Company address' },
                { id: 'website', title: 'Company website' },
                { id: 'size', title: 'Company size' },
                { id: 'turnover', title: 'Company turnover' },
                { id: 'mailFrom', title: 'Email taken from' },
                { id: 'vacancyParsedDate', title: 'Parsed date' },
                { id: 'vacancyDate', title: 'Vacancy Date' },
                { id: 'vacancyTitle', title: 'Vacancy Title' },
                { id: 'vacancyLink', title: 'Vacancy Link' },
            ],
        });
        const records = companies.map((company) => {
            var _a, _b;
            return {
                note: company.note,
                sentEmails: company.sentEmails,
                name: company.name,
                email: checkEmail(company.email),
                phone: company.phone,
                status: company.status,
                positionKeyword: company.positionKeyword,
                placeKeyword: company.placeKeyword,
                industry: company.industry,
                address: company.address,
                website: company.website,
                size: company.size,
                turnover: company.turnover,
                mailFrom: company.mailFrom,
                vacancyParsedDate: (_a = company.vacancyParsedDate) === null || _a === void 0 ? void 0 : _a.toISOString(),
                vacancyDate: (_b = company.vacancyDate) === null || _b === void 0 ? void 0 : _b.toISOString(),
                vacancyTitle: company.vacancyTitle,
                vacancyLink: company.vacancyLink,
            };
        });
        await csvWriter.writeRecords(records);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=companies.csv');
        res.download(filePath);
    }
    catch (err) {
        next(err);
    }
}
function countCompaniesByStatus(companies, user) {
    const companiesCount = {
        all: {
            count: companies.length,
            percent: 100,
        },
        white: {
            count: 0,
            percent: 0,
        },
        grey: {
            count: 0,
            percent: 0,
        },
        black: {
            count: 0,
            percent: 0,
        },
        request: {
            count: 0,
            percent: 0,
        },
        process: {
            count: 0,
            percent: 0,
        },
        reject: {
            count: 0,
            percent: 0,
        },
        success: {
            count: 0,
            percent: 0,
        },
    };
    companies.forEach((company) => {
        if (company.user.toString() !== user._id.toString()) {
            return;
        }
        switch (company.status) {
            case Status.WHITE:
                companiesCount.white.count++;
                break;
            case Status.GREY:
                companiesCount.grey.count++;
                break;
            case Status.BLACK:
                companiesCount.black.count++;
                break;
            case Status.REQUEST:
                companiesCount.request.count++;
                break;
            case Status.PROCESS:
                companiesCount.process.count++;
                break;
            case Status.REJECT:
                companiesCount.reject.count++;
                break;
            case Status.SUCCESS:
                companiesCount.success.count++;
                break;
        }
    });
    Object.keys(companiesCount).forEach((key) => {
        if (key !== 'all') {
            companiesCount[key].percent = Math.round((companiesCount[key].count / companiesCount.all.count) * 10000) / 100;
        }
    });
    return companiesCount;
}
//# sourceMappingURL=company.controller.js.map