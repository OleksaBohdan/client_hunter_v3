import puppeteer from 'puppeteer';
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

function vacanciesPage(position: string, city: string, page: number) {
  return `https://www.xing.com/jobs/search?country=de.02516e&keywords=${position}&location=${city}&page=${page}`;
}
const vacancyLinkSelector: any = 'a.sc-1lqq9u1-0.hUhrnN';
const stopSelector: any = 'h2.sc-1gpssxl-0.gIZiug.sc-100kd7l-2.eNKBEp';
const companyNameSelector: any = 'p.body-copystyles__BodyCopy-x85e3j-0.crPMQE';
const companyIndustrySelector: any =
  'p.body-copystyles__BodyCopy-x85e3j-0.jaFHYD.metastyles__Meta-y4z6ql-0.goBtoq.subheaderstyles__Industry-sc-1u9xecu-2.lpvnHp[data-xds="Meta"]';
const vacancyTitleSelector: any = 'div.titlestyles__TitleContainer-bl83l1-3 h1[data-testid="job-title"]';
const publishedDateSelector: any = 'p[data-testid="published-date"]';
const companyLinkSelector: any = 'div[data-testid="header-company-info"] a[data-testid="company-logo-link"]';
const employeesCountSelector: any =
  'div.EntityInfo-EntityInfo-entityInfoBlockWrapper-d20bbe9a div.EntityInfo-EntityInfo-hideBorderOnLowRes-de1e9fc9 p[data-xds="BodyCopy"] span.EntityInfo-EntityInfo-entityInfoBlockValue-aaacef7d';
const addressSelector: any =
  'div.locations-Location-addressWrapper-e0891ff2[data-testid="locations-address-card"] p.locations-Location-address-aa54f5ed';
const emailSelector: any = 'div.locations-Location-addressWrapper-e0891ff2 a[href^="mailto:"]';
const websiteSelector: any =
  'div.locations-Location-addressWrapper-e0891ff2 div.locations-Location-websiteLink-e29143d7 a[href^="http"]';
const phoneNumberSelector: any = 'a[href^="tel:"]';

export async function runXingParser(user: IUser, city: string, position: string) {
  const PARALLEL_PAGE = 3;
  let VACANCY_LINKS: string[] = [];
  let socket = clients[user._id.toString()];
  stopFlags.set(user._id.toString(), false);

  socket.send(JSON.stringify(socketMessage('Lounching parser...', 'regular')));

  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: {
      width: 1200,
      height: 900,
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
  for (let i = 1; true; i++) {
    try {
      socket.send(
        JSON.stringify(socketMessage(`Fetch vacancy likns go to ${vacanciesPage(position, city, i)}`, 'regular')),
      );
      await page.goto(vacanciesPage(position, city, i));
      await page.waitForSelector(vacancyLinkSelector);
      const stopElement = await page.$(stopSelector);

      if (!stopElement) {
        const hrefs = await page.$$eval(vacancyLinkSelector, (links) => {
          return links.map((link) => (link as HTMLAnchorElement).href);
        });

        VACANCY_LINKS.push(...hrefs);
      } else {
        socket.send(JSON.stringify(socketMessage(`Found ${VACANCY_LINKS.length} vacancies`, 'success')));
        break;
      }
    } catch (err) {
      socket.send(JSON.stringify(socketMessage(`Fetch vacancy likns: ${err}`, 'error')));
      console.log(err);
      break;
    }
  }

  // Filter links from DB and recently founded
  const existingLinks = await readCompaniesVacancyLink(user);
  VACANCY_LINKS = removeExistingVacancyLinks(VACANCY_LINKS, existingLinks);
  const existingEmails = await readCompaniesEmails(user);

  // parsing vacancy pages
  const vacancyPages = [];
  for (let i = 0; i < PARALLEL_PAGE; i++) {
    vacancyPages.push(await browser.newPage());
  }

  for (let i = 0; i < VACANCY_LINKS.length; i += PARALLEL_PAGE) {
    socket.send(JSON.stringify(socketMessage(`${(i / VACANCY_LINKS.length) * 100}`, 'progress')));
    const promises = [];
    for (let j = 0; j < PARALLEL_PAGE && i + j < VACANCY_LINKS.length; j++) {
      promises.push(
        parseVacancyPage(VACANCY_LINKS[i + j], vacancyPages[j], user, position, city, existingEmails, socket),
      );
    }
    await Promise.all(promises);
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

async function parseVacancyPage(
  link: string,
  page: puppeteer.Page,
  user: IUser,
  positionKeyword: string,
  placeKeyword: string,
  emails: string[],
  socket: WebSocket,
) {
  try {
    await page.goto(link);
    socket.send(JSON.stringify(socketMessage(`Go to vacancy ${link}`, 'regular')));

    const newCompany: ICompany = new Company();
    newCompany.vacancyLink = link;
    newCompany.positionKeyword = positionKeyword;
    newCompany.placeKeyword = placeKeyword;

    // get company name
    try {
      await page.waitForSelector(companyNameSelector, { timeout: 5000 });
      const companyNameElement = await page.$(companyNameSelector);
      if (companyNameElement) {
        const companyName = await page.evaluate((element) => element.textContent, companyNameElement);
        if (companyName) {
          newCompany.name = companyName?.trim();
        }
      }
    } catch (err) {
      socket.send(JSON.stringify(socketMessage(`Cannot find companyNameSelector ${link}`, 'error')));
    }

    // get company industry
    try {
      const companyIndustryElement = await page.$(companyIndustrySelector);
      if (companyIndustryElement) {
        const industryText = await page.evaluate((element) => element.textContent, companyIndustryElement);
        if (industryText) {
          newCompany.industry = industryText.trim();
        }
      }
    } catch (err) {
      socket.send(JSON.stringify(socketMessage(`Cannot find companyIndustrySelector ${link}`, 'error')));
      // console.error(err);
    }

    //get vacancy title
    try {
      const vacancyTitleElement = await page.$(vacancyTitleSelector);
      if (vacancyTitleElement) {
        const vacancyTitle = await page.evaluate((element) => element.textContent, vacancyTitleElement);
        if (vacancyTitle) {
          newCompany.vacancyTitle = vacancyTitle.trim();
        }
      }
    } catch (err) {}

    // get vacancy posted date
    try {
      const publishedDateElement = await page.$(publishedDateSelector);
      if (publishedDateElement) {
        const publishedDateText = await page.evaluate((element) => element.textContent, publishedDateElement);
        if (publishedDateText) {
          const daysAgoMatch = publishedDateText.match(/\d+/);
          if (daysAgoMatch) {
            const daysAgo = parseInt(daysAgoMatch[0]);
            const realDatePosted = new Date();
            realDatePosted.setDate(realDatePosted.getDate() - daysAgo);
            newCompany.vacancyDate = realDatePosted;
          }
        }
      }
    } catch (err) {}

    // get link with company data
    let companyDataLink: any;
    try {
      const companyLinkElement = await page.$(companyLinkSelector);
      if (companyLinkElement) {
        companyDataLink = await page.evaluate((element) => element.getAttribute('href'), companyLinkElement);
      }
    } catch (err) {}

    if (!companyDataLink) {
      return;
    }

    // go to company Data page
    try {
      await page.goto(companyDataLink);
    } catch (err) {
      return;
    }

    // get company size
    try {
      const employeesCountElement = await page.$(employeesCountSelector);
      if (employeesCountElement) {
        const employeesRange = await page.evaluate((element) => element.textContent, employeesCountElement);
        if (employeesRange) {
          const rangeParts = employeesRange.split('-');
          const employeesCount = rangeParts.length > 1 ? rangeParts[1] : rangeParts[0];
          newCompany.size = +employeesCount;
        }
      }
    } catch (err) {}

    // get company address
    try {
      const addressElement = await page.$(addressSelector);
      if (addressElement) {
        const companyAddress = await page.evaluate((element) => element.textContent, addressElement);
        if (companyAddress) {
          newCompany.address = companyAddress;
        }
      }
    } catch (err) {}

    // get company email
    try {
      const emailElement = await page.$(emailSelector);
      if (emailElement) {
        const companyEmail = await page.evaluate((element) => element.textContent, emailElement);
        if (companyEmail) {
          const validEmail = isEmail(companyEmail);
          if (validEmail != '') {
            if (emails.includes(validEmail)) {
              socket.send(JSON.stringify(socketMessage(`Email already exists from ${link}.`, 'warning')));
            } else {
              newCompany.email = validEmail;
            }
          }
        }
      }
    } catch (err) {}

    // get company website
    try {
      const websiteElement = await page.$(websiteSelector);
      if (websiteElement) {
        const companyWebsite = await page.evaluate((element) => element.textContent, websiteElement);
        if (companyWebsite) {
          newCompany.website = companyWebsite;
        }
      }
    } catch (err) {}

    // get phone
    try {
      const phoneNumberElement = await page.$(phoneNumberSelector);
      if (phoneNumberElement) {
        const phoneNumberText = await page.evaluate((element) => element.textContent, phoneNumberElement);
        if (phoneNumberText) {
          const phoneNumberMatch = phoneNumberText.match(/\+[\d\s]+/);
          if (phoneNumberMatch) {
            const phoneNumber = phoneNumberMatch[0].trim();
            newCompany.phone = phoneNumber;
          }
        }
      }
    } catch (err) {}

    // create new company
    try {
      newCompany.mailFrom = 'jobsite';
      await createCompany(newCompany, user);
      socket.send(JSON.stringify(socketMessage(`Found new company!`, 'success')));
    } catch (err) {
      // console.log('createCompany \n', err);
    }
  } catch (err) {}
}
