import puppeteer from 'puppeteer';
import url from 'url';
import { ICompany, Company } from '../../../databases/mongo/models/Company.js';
import { readAllCompanies } from '../../repositories/company.service.js';
import { IUser } from '../../../databases/mongo/models/User.js';
import { createCompany } from '../../repositories/company.service.js';
import { stopFlags } from '../../../controllers/startParser.controller.js';
import WebSocket from 'ws';
import { socketMessage } from '../../../websocket/websocket.js';
import { clients } from '../../../websocket/websocket.js';

const websitePage = 'https://startupverband.de/verband/mitglieder/';

export interface IStartupCompany {
  email: string | null;
  phone: string | null;
  name: string | null;
  website: string | null;
  address: string | null;
  memberType: string | null;
}

export async function runStartupverbandParser(user: IUser) {
  let STARTUP_COMPANIES: IStartupCompany[] = [];

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
    ignoreHTTPSErrors: true,
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

    socket.send(JSON.stringify(socketMessage(`Parse page ${startPage}`, 'regular')));

    await page.waitForSelector('a.paginate_button');

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

    let companies = await page.$$eval(
      'tbody > tr',
      (rows) =>
        rows.map((row) => {
          const tds = Array.from(row.getElementsByTagName('td'));
          const nameElement = tds[0].querySelector('a') as HTMLAnchorElement;
          const addressElement = tds[2].querySelector('a') as HTMLAnchorElement;
          const memberTypeElement = tds[4].querySelector('a') as HTMLAnchorElement;

          return {
            name: nameElement ? nameElement.textContent : '',
            website: nameElement ? nameElement.href : '',
            address: addressElement ? addressElement.textContent : '',
            memberType: memberTypeElement ? memberTypeElement.textContent : '',
          };
        }) as IStartupCompany[],
    );

    companies = companies.map((company) => {
      return {
        ...company,
        email: null,
        phone: null,
      };
    });

    STARTUP_COMPANIES = [...STARTUP_COMPANIES, ...companies];

    startPage++;
  }

  socket.send(JSON.stringify(socketMessage(`Found ${STARTUP_COMPANIES.length} companies.`, 'regular')));

  // remove from STARTUP_COMPANIES Startup / Alumni memberType
  socket.send(JSON.stringify(socketMessage(`Searching only 'Startup / Alumni' member type...`, 'regular')));
  STARTUP_COMPANIES = STARTUP_COMPANIES.filter(
    (company) => company.memberType && company.memberType === 'Startup / Alumni',
  );

  socket.send(
    JSON.stringify(
      socketMessage(`Found ${STARTUP_COMPANIES.length} companies with 'Startup / Alumni' member type.`, 'regular'),
    ),
  );

  // remove existing companies from STARTUP_COMPANIES list
  try {
    const existingCompanies = await readAllCompanies(user);

    STARTUP_COMPANIES = STARTUP_COMPANIES.filter((startupCompany) => {
      return !existingCompanies.find((existingCompany) => existingCompany.name === startupCompany.name);
    });
  } catch (err) {
    if (err instanceof Error) {
      socket.send(JSON.stringify(socketMessage(`Error in readCompanies: ${err.message} `, 'error')));
    }
  }
  socket.send(
    JSON.stringify(
      socketMessage(
        `Found ${STARTUP_COMPANIES.length} companies with 'Startup / Alumni' member type that not exists in the database`,
        'regular',
      ),
    ),
  );

  // parsing website pages
  for (let i = 0; i <= STARTUP_COMPANIES.length; i++) {
    socket.send(JSON.stringify(socketMessage(`${(i / STARTUP_COMPANIES.length) * 100}`, 'progress')));
    try {
      await scrapeEmailFromWebsite(STARTUP_COMPANIES[i], page, socket, user);
    } catch (err) {
      if (err instanceof Error) {
        // socket.send(JSON.stringify(socketMessage(`Error in scrapeEmailFromWebsite: ${err.message} `, 'error')));
      }
    }
  }

  // finish
  socket.send(JSON.stringify(socketMessage(`${100}`, 'progress')));
  socket.send(
    JSON.stringify(
      socketMessage(`Check the Whitelist for email results and the Greylist for email non-existence.`, 'success'),
    ),
  );
  socket.send(JSON.stringify(socketMessage(`Parser has finished work`, 'success')));
  stopFlags.delete(user._id.toString());
  await browser.close();
}

async function scrapeEmailFromWebsite(
  startupCompany: IStartupCompany,
  page: puppeteer.Page,
  socket: WebSocket,
  user: IUser,
) {
  if (startupCompany.website == null) {
    socket.send(JSON.stringify(socketMessage(`Company '${startupCompany.name}' has no website`, 'warning')));
    try {
      const newCompany: ICompany = new Company();
      newCompany.name = startupCompany.name ?? '';
      newCompany.address = startupCompany.address ?? '';
      newCompany.website = '';
      newCompany.email = '';
      await createCompany(newCompany, user);
      socket.send(JSON.stringify(socketMessage(`Found new company!`, 'success')));
    } catch (err) {
      // console.log('createCompany \n', err);
    }
    return;
  }

  const newCompany: ICompany = new Company();
  newCompany.name = startupCompany.name ? startupCompany.name : '';
  newCompany.address = startupCompany.address ? startupCompany.address : '';
  newCompany.website = startupCompany.website ? startupCompany.website : '';

  socket.send(
    JSON.stringify(socketMessage(`Go to company ${startupCompany.name} website ${startupCompany.website}`, 'regular')),
  );

  await page.goto(startupCompany.website);

  let pageContent = await page.content();
  const emailRegex =
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(?!jpg|png|jpeg|gif|bmp|tiff|webp|mp3|wav|mp4|avi|doc|docx|pdf)[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /\+49\s?(\([0-9]+\))?(\s?[0-9]{1,})+\b/g;
  const phones = pageContent.match(phoneRegex);

  socket.send(JSON.stringify(socketMessage(`Looking for company ${startupCompany.name} email...`, 'regular')));
  let emails = pageContent.match(emailRegex);

  // If email is not found on the main page, start checking other pages.
  if (!emails) {
    let links = await page.$$eval('a', (links) => links.map((link) => link.href));

    const domain = url.parse(startupCompany.website).hostname;

    links = links.filter((link) => url.parse(link).hostname === domain);

    let counter = 0;
    for (const link of links) {
      if (counter >= 30) break;
      socket.send(
        JSON.stringify(socketMessage(`Go to company ${startupCompany.name} website page ${link}`, 'regular')),
      );
      await page.goto(link);

      pageContent = await page.content();
      emails = pageContent.match(emailRegex);

      if (emails) break;
      counter++;
    }
  }

  if (!emails) {
    socket.send(
      JSON.stringify(
        socketMessage(
          `Email not found for company '${startupCompany.name}' on website ${startupCompany.website}`,
          'regular',
        ),
      ),
    );
  }

  if (emails) {
    socket.send(JSON.stringify(socketMessage(`Email found for company '${startupCompany.name}'`, 'regular')));
    newCompany.email = emails ? emails[0] : '';
  }

  if (phones) {
    newCompany.phone = phones.join(';');
  }

  try {
    await createCompany(newCompany, user);
    socket.send(JSON.stringify(socketMessage(`Found new company!`, 'success')));
  } catch (err) {
    if (err instanceof Error) {
      socket.send(JSON.stringify(socketMessage(`Error in createCompany: ${err.message} `, 'error')));
    }
  }
  return;
}
