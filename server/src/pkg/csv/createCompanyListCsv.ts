import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { readCompaniesByStatus } from '../../services/repositories/company.service.js';

const csvWriter = createObjectCsvWriter({
  path: 'src/pkg/csv/data/companies.csv',
  header: [
    { id: 'id', title: 'ID' },
    { id: 'note', title: 'Note' },
    { id: 'status', title: 'List status' },
    { id: 'positionKeyword', title: 'Position keyword' },
    { id: 'placeKeyword', title: 'City' },
    { id: 'mailFrom', title: 'Email from' },
    { id: 'email', title: 'Email' },
    { id: 'phone', title: 'Phone' },
    { id: 'name', title: 'Company name' },
    { id: 'website', title: 'Company website' },
    { id: 'vacancyLink', title: 'Vanancy link' },
    { id: 'additionalInfo', title: 'Additional info' },
    { id: 'industry', title: 'Industry' },
    { id: 'vacancyTitle', title: 'Vacancy title' },
    { id: 'address', title: 'Company address' },
    { id: 'size', title: 'Company size' },
    { id: 'turnover', title: 'Company turnover' },
    { id: 'vacancyDate', title: 'Vacancy posted' },
    { id: 'vacancyParsedDate', title: 'Parsed date' },
    { id: 'sentEmails', title: 'Marketing email IDs' },
  ],
  fieldDelimiter: ',',
});

const headersList: object = {
  id: 'id',
  note: 'note',
  status: 'status',
  positionKeyword: 'positionKeyword',
  placeKeyword: 'placeKeyword',
  mailFrom: 'mailFrom',
  email: 'email',
  phone: 'phone',
  name: 'name',
  website: 'website',
  vacancyLink: 'vacancyLink',
  additionalInfo: 'additionalInfo',
  industry: 'industry',
  vacancyTitle: 'vacancyTitle',
  address: 'address',
  size: 'size',
  turnover: 'turnover',
  vacancyDate: 'vacancyDate',
  vacancyParsedDate: 'vacancyParsedDate',
  sentEmails: 'sentEmails',
};

let records: any[] = [];

export async function getCompanies(status: string) {
  console.log('list from csvWriter', status);
  const companies = await readCompaniesByStatus(status);

  for (let i = 0; i < companies.length; i++) {
    const company = {
      id: companies[i]._id,
      note: companies[i].note,
      status: companies[i].status,
      positionKeyword: companies[i].positionKeyword,
      placeKeyword: companies[i].placeKeyword,
      mailFrom: companies[i].mailFrom,
      email: companies[i].email,
      phone: companies[i].phone,
      name: companies[i].name,
      website: companies[i].website,
      vacancyLink: companies[i].vacancyLink,
      additionalInfo: companies[i].additionalInfo,
      industry: companies[i].industry,
      vacancyTitle: companies[i].vacancyTitle,
      address: companies[i].address,
      size: companies[i].size,
      turnover: companies[i].turnover,
      vacancyDate: companies[i].vacancyDate,
      vacancyParsedDate: companies[i].vacancyParsedDate,
      sentEmails: companies[i].sentEmails,
    };

    records.push(company);
  }
}

export async function writeCSV() {
  csvWriter.writeRecords(records).then(() => {
    records = [];
    records.push(headersList);
  });
}
