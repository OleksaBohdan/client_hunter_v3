import puppeteer from 'puppeteer';
import { isEmail, validateCanadaPhone } from '../pkg/validators.js';
import { removeExistingVacancyLinks } from '../pkg/filters.js';
import { ICompany, Company } from '../../../databases/mongo/models/Company.js';
import { IUser } from '../../../databases/mongo/models/User.js';
import { createCompany, readCompaniesEmails } from '../../repositories/company.service.js';
import { readCompaniesVacancyLink } from '../../repositories/company.service.js';
import { stopFlags } from '../../../controllers/startParser.controller.js';
import WebSocket from 'ws';
import { socketMessage } from '../../../websocket/websocket.js';
import { clients } from '../../../websocket/websocket.js';

// Home page
function vacanciesPage(position: string, city: string, page: number) {
  return `https://www.xing.com/jobs/search?country=de.02516e&keywords=${position}&location=${city}&page=${page}`;
}
const vacancyLinkSelector: any = '';

export async function runXingParser(user: IUser, city: string, position: string) {
  const PARALLEL_PAGE = 3;
  const VACANCY_LINKS: string[] = [];
  const socket = clients[user._id.toString()];
  stopFlags.set(user._id.toString(), false);

  socket.send(JSON.stringify(socketMessage('Lounching parser...', 'regular')));

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 900,
    },
  });

  async function process() {
    if (stopFlags.get(user._id.toString())) {
      socket.send(JSON.stringify(socketMessage('STOP', 'regular')));
      await browser.close();
      stopFlags.delete(user._id.toString());
      return;
    }

    if (user._id.toString()) {
      setTimeout(process, 1000);
    }
  }
  process();

  const page = await browser.newPage();

  try {
    for (let i = 1; true; i++) {
      try {
        await page.goto(vacanciesPage(position, city, i));
        await page.waitForSelector('a.list-item-job-teaser-list-item-listItem-f04c772e');
        const hrefs = await page.$$eval('a.list-item-job-teaser-list-item-listItem-f04c772e', (links) => {
          return links.map((link) => (link as HTMLAnchorElement).href);
        });

        VACANCY_LINKS.push(...hrefs);
        console.log(hrefs);
      } catch (err) {
        await browser.close();
        console.log('VACANCY_LINKS', VACANCY_LINKS);
      }
    }
  } catch (err) {}

  return;
}

// 1. Collect vacancy links
// 2. Go for each link and parse data
// 3. Close
