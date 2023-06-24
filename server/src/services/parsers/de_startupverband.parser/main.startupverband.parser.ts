import puppeteer from 'puppeteer';
import url from 'url';
import { isEmail } from '../pkg/validators.js';
import { removeExistingVacancyLinks } from '../pkg/filters.js';
import { ICompany, Company } from '../../../databases/mongo/models/Company.js';
import { IUser } from '../../../databases/mongo/models/User.js';
import { createCompany, readCompaniesEmails } from '../../repositories/company.service.js';
import { readCompaniesVacancyLink } from '../../repositories/company.service.js';
import { stopFlags } from '../../../controllers/startParser.controller.js';
import WebSocket from 'ws';
import { socketMessage } from '../../../websocket/websocket.js';
import { clients } from '../../../websocket/websocket.js';

const websitePage = 'https://startupverband.de/verband/mitglieder/';

export async function runStartupverbandParser(user: IUser) {
  let VACANCY_LINKS: string[] = [];

  let socket = clients[user._id.toString()];
  stopFlags.set(user._id.toString(), false);

  socket.send(JSON.stringify(socketMessage('Lounching parser...', 'regular')));

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 1200,
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--disable-infobars',
    ],
  });

  async function process() {
    socket = clients[user._id.toString()];

    if (stopFlags.get(user._id.toString())) {
      socket.send(JSON.stringify(socketMessage('STOP', 'warning')));
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

  // fetch vacancy links
  socket.send(JSON.stringify(socketMessage('Calculating vacancies...', 'regular')));

  //... some code
  await page.goto(websitePage, { waitUntil: 'networkidle0' });

  let startPage = 1;
  const lastPageNumber = await page.$eval('a.paginate_button:last-child', (el) => el.textContent);
  if (lastPageNumber === null) {
    socket.send(JSON.stringify(socketMessage('No pagination element found!', 'error')));
    return;
  }

  while (true) {
    if (startPage > +lastPageNumber) {
      break;
    }

    await page.$$eval(
      'a.paginate_button',
      (buttons, desiredPageNumber) => {
        for (const button of buttons) {
          if (button.textContent == desiredPageNumber) {
            button.click();
          }
        }
      },
      `${startPage}`,
    );

    const links = await page.$$eval('tbody > tr > td > a', (anchors) =>
      anchors.map((anchor) => {
        let link = anchor.href;
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
          link = 'http://' + link;
        }
        return link;
      }),
    );

    startPage++;

    VACANCY_LINKS = [...VACANCY_LINKS, ...links];

    await page.waitForTimeout(200);
  }

  VACANCY_LINKS = [...new Set(VACANCY_LINKS)];

  console.log(VACANCY_LINKS);

  socket.send(JSON.stringify(socketMessage(`Found ${VACANCY_LINKS.length} vacancy links.`, 'regular')));

  // parsing website pages
  //... some code

  // finish
  socket.send(JSON.stringify(socketMessage(`${100}`, 'progress')));
  socket.send(
    JSON.stringify(
      socketMessage(`Check the Whitelist for email results and the Greylist for email non-existence.`, 'success'),
    ),
  );
  socket.send(JSON.stringify(socketMessage(`Parser has finished work`, 'success')));
  stopFlags.delete(user._id.toString());
  // await browser.close();
}

async function scrapeEmailFromWebsite(startingUrl: string, page: puppeteer.Page) {
  await page.goto(startingUrl);

  let pageContent = await page.content();

  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;

  let emails = pageContent.match(emailRegex);

  // If email is not found on the main page, start checking other pages.
  if (!emails) {
    let links = await page.$$eval('a', (links) => links.map((link) => link.href));

    const domain = url.parse(startingUrl).hostname;

    links = links.filter((link) => url.parse(link).hostname === domain);

    for (const link of links) {
      await page.goto(link);

      pageContent = await page.content();
      emails = pageContent.match(emailRegex);

      if (emails) break;
    }
  }

  return emails;
}
