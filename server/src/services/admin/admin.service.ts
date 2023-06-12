import csvtojsonV1 from 'csvtojson';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Company } from '../../databases/mongo/models/Company.js';
import { Status } from '../../databases/mongo/models/Company.js';

const dirName = path.dirname(new URL(import.meta.url).pathname);
const filePath = path.join(dirName, 'black-companies.csv');
const userID = '';

export async function transferCompanies() {
  console.log('Tranfering db...');

  const csvData = await csvtojsonV1().fromFile(filePath);

  const mappedData = csvData.map((row) => {
    return {
      note: '',
      positionKeyword: '',
      placeKeyword: '',
      mailFrom: '',
      email: row['Company email'] || uuidv4(),
      phone: row['Company phone'],
      name: row['Company name'],
      website: row['Company website'],
      vacancyLink: row['Vacancy link'],
      additionalInfo: '',
      industry: '',
      vacancyTitle: row['Keywords'],
      address: row['Company address'],
      size: row['Company size'] ? parseInt(row['Company size'], 10) : undefined,
      turnover: row['Turnover (number)'] ? parseInt(row['Turnover (number)'], 10) : undefined,
      vacancyDate: row['Created date'] ? new Date(row['Created date']) : undefined,
      status: Status.BLACK,
      vacancyParsedDate: new Date(),
      sentEmails: [],
      user: [userID],
    };
  });

  let count = 0;

  mappedData.forEach(async (company) => {
    try {
      await Company.create(company);
    } catch (err) {
      count++;
      console.log('error', count, err);
    }
  });
}
