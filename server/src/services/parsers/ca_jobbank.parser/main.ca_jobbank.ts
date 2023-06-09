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

const homePage = 'https://www.jobbank.gc.ca/';
const outOfCanadaModal: any = 'a[onclick*="outOfCanadaCloseBtn"][id="j_id_5i:outOfCanadaCloseBtn"][title="Cancel"]';
const inputPositionSelector: any =
  'input[aria-describedby="what"][name="searchstring"][id="searchString"][placeholder="Example: Cook"]';
const inputCitySelector: any =
  'input#locationstring[name="locationstring"].form-control.input-lg.tt-input[placeholder="Location"]';
const searchButtonSelector: any = 'button#searchButton.btn.btn-primary[type="submit"]';
const numberOfVacanciesSelector: any = 'button#searchButton.btn.btn-primary[type="submit"]';
// const moreResultsBtnSelector: any = 'button.btn.btn-default.btn-sm.btn-block#moreresultbutton[onclick="showmore();"]';
const moreResultsBtnSelector: any = '#moreresultbutton';
const jobListElementSelector: any = '#ajaxupdateform\\:result_block article a';
const howToapplyBtnSelector: any = 'p > button#applynowbutton';
const emailSelector: any = '#howtoapply p a';
const phoneSelector: any = '#howtoapply p:nth-of-type(2)';
const additionalInfoSelector: any = '#tp_referenceNumber';
const companyNameSelector: any = 'p.date-business span.business span[property="name"] strong';
const postCreatedSelector: any = 'p.date-business span.date';
const vacancyTitleSelector: any = 'h1.title span[property="title"]';
const vacancyWebsiteSelector: any = 'span[property="hiringOrganization"] span[property="name"] a.external';

export async function runCaJobankParser(user: IUser, city: string, position: string) {
  const PARALLEL_PAGE = 3;
  let VACANCY_LINKS: string[] = [];
  let socket = clients[user._id.toString()];
  stopFlags.set(user._id.toString(), false);
  socket.send(JSON.stringify(socketMessage('Lounching parser...', 'regular')));

  const browser = await puppeteer.launch({
    headless: false,
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

  try {
    socket.send(JSON.stringify(socketMessage(`Going to website: ${homePage}`, 'regular')));
    await page.goto(homePage);
  } catch (err) {
    socket.send(JSON.stringify(socketMessage(`Parser terminated unexpectedly. Please, try again`, 'error')));
    stopFlags.delete(user._id.toString());
    await browser.close();
  }

  // close modal
  try {
    await page.waitForSelector(outOfCanadaModal, { timeout: 5000 });
    const closeModalButton = await page.$(outOfCanadaModal);
    if (closeModalButton) {
      socket.send(JSON.stringify(socketMessage(`Closing bad modal...`, 'regular')));
      await closeModalButton.click();
    }
  } catch (err) {
    socket.send(JSON.stringify(socketMessage(`closeModal: \n ${err}`, 'error')));
  }

  // enter value - vacancy position
  try {
    await page.waitForSelector(inputPositionSelector);
    const inputPositionElement = await page.$(inputPositionSelector);
    if (inputPositionElement) {
      await inputPositionElement.type(position);
    }
  } catch (err) {
    socket.send(JSON.stringify(socketMessage(`inputPositionSelector: \n ${err}`, 'error')));
  }

  // enter value - city
  try {
    await page.waitForSelector(inputCitySelector);
    const inputCityElement = await page.$(inputCitySelector);
    if (inputCityElement) {
      await inputCityElement.type(city);
    }
  } catch (err) {
    socket.send(JSON.stringify(socketMessage(`inputCitySelector: \n ${err}`, 'error')));
  }

  // click to search
  try {
    socket.send(JSON.stringify(socketMessage(`Seraching vacancies...`, 'regular')));

    await page.waitForSelector(searchButtonSelector);
    const searchButton = await page.$(searchButtonSelector);
    if (searchButton) {
      await searchButton.click();
    }
  } catch (err) {
    socket.send(JSON.stringify(socketMessage(`searchButtonSelector: \n ${err}`, 'error')));
  }

  // get results number
  let numberOfVacancies: any;
  try {
    await page.waitForSelector(numberOfVacanciesSelector);
    numberOfVacancies = await page.$eval('span.found', (element) => element.textContent);
    socket.send(JSON.stringify(socketMessage(`Found ${numberOfVacancies} vacancies`, 'success')));
    if (numberOfVacancies === '0') {
      socket.send(JSON.stringify(socketMessage(`FINISH - VACANCIES NOT FOUND`, 'warning')));
      stopFlags.delete(user._id.toString());
      await browser.close();
      return;
    }
  } catch (err) {
    socket.send(JSON.stringify(socketMessage(`numberOfVacanciesSelector: \n ${err}`, 'error')));
  }

  // open list with vacancy links
  async function showAllVanacyLinks() {
    console.log('open list with vacancy links');
    for (let i = 0; i < Math.ceil(parseInt(numberOfVacancies, 10) / 25); i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      try {
        await page.waitForSelector(moreResultsBtnSelector, { timeout: 5000 });

        const moreResultsButton = await page.$(moreResultsBtnSelector);
        if (moreResultsButton) {
          moreResultsButton.click();
        }
      } catch (err) {
        socket.send(JSON.stringify(socketMessage(`moreResultsBtnSelector: \n ${err}`, 'error')));
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  await showAllVanacyLinks();

  // fetch vacancy links
  try {
    console.log('fetch vacancy links');
    await page.waitForSelector(jobListElementSelector, { timeout: 7000 });
    const jobListingElements = await page.$$(jobListElementSelector);
    const hrefs = await Promise.all(jobListingElements.map((el) => el.evaluate((a) => a.getAttribute('href'))));
    console.log(hrefs);
    console.log(hrefs.length);
    if (hrefs != null) {
      const filteredHrefs = hrefs.filter((href) => href && !href.includes('/login'));
      const prefixedHrefs = filteredHrefs.map((href) => `https://www.jobbank.gc.ca${href}`);
      VACANCY_LINKS = prefixedHrefs;
    }
  } catch (err) {
    socket.send(JSON.stringify(socketMessage(`jobListElementSelector: \n ${err}`, 'error')));
  }

  // await page.close();

  // Filter links from DB and recently founded
  const existingLinks = await readCompaniesVacancyLink(user);
  console.log('existingLinks', existingLinks.length);
  VACANCY_LINKS = removeExistingVacancyLinks(VACANCY_LINKS, existingLinks);
  console.log('VACANCY_LINKS', VACANCY_LINKS.length);
  const existingEmails = await readCompaniesEmails(user);
  // socket.send(JSON.stringify(socketMessage(`Found new vacancies: ${VACANCY_LINKS.length}`, 'success')));

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

async function parseVacancyPage(
  link: string,
  page: puppeteer.Page,
  user: IUser,
  positionKeyword: string,
  placeKeyword: string,
  emails: string[],
  socket: WebSocket,
) {
  const newCompany: ICompany = new Company();
  newCompany.vacancyLink = link;
  newCompany.positionKeyword = positionKeyword;
  newCompany.placeKeyword = placeKeyword;

  try {
    await page.goto(link);
    socket.send(JSON.stringify(socketMessage(`Go to vacancy ${link}`, 'regular')));

    // click btn - 'HOW TO APPLY'
    try {
      await page.waitForSelector(howToapplyBtnSelector, { timeout: 5000 });
      const buttonElement = await page.$(howToapplyBtnSelector);
      if (buttonElement) {
        await buttonElement.click();
      }
    } catch (err) {}

    // get email
    try {
      await page.waitForSelector(emailSelector, { timeout: 3000 });
      const email = await page.$eval(emailSelector, (element) => element.textContent);
      const validEmail = isEmail(email);
      if (validEmail != '') {
        if (emails.includes(validEmail)) {
          socket.send(JSON.stringify(socketMessage(`Email from ${link} already exists in company list.`, 'warning')));
          return;
        }
        newCompany.email = validEmail;
      }
    } catch (err) {}

    // get phone
    try {
      const phone = await page.$eval(phoneSelector, (element) => element.textContent?.trim().split('\n')[0]);
      if (validateCanadaPhone(phone) != '') {
        newCompany.phone = validateCanadaPhone(phone);
      }
    } catch (err) {}

    // get reference number
    try {
      const additionalInfo = await page.$eval(additionalInfoSelector, (el) =>
        el.previousSibling ? el.previousSibling.textContent?.trim() : null,
      );
      newCompany.additionalInfo = additionalInfo;
    } catch (err) {}

    // get company name
    try {
      const companyName = await page.$eval(companyNameSelector, (element) => element.textContent);
      if (!companyName) {
        return;
      }
      newCompany.name = companyName.trim();
    } catch (err) {}

    // get company website
    try {
      const website = await page.$eval(vacancyWebsiteSelector, (anchor) => anchor.href);
      newCompany.website = website;
      const companyName = await page.$eval(vacancyWebsiteSelector, (anchor) => anchor.textContent);
      if (companyName) {
        newCompany.name = companyName;
      }
    } catch (err) {}

    // get postCreated
    try {
      const datePosted = await page.$eval(postCreatedSelector, (element) => element.textContent);
      if (datePosted) {
        const date = new Date(datePosted);
        newCompany.vacancyDate = date;
      }
    } catch (err) {}

    // get Vacancy Job title
    try {
      const jobTitle = await page.$eval(vacancyTitleSelector, (element) => element.textContent);
      const title = jobTitle?.trim();
      newCompany.vacancyTitle = title;
    } catch (err) {}

    try {
      newCompany.mailFrom = 'jobsite';
      await createCompany(newCompany, user);
      socket.send(JSON.stringify(socketMessage(`Found new company!`, 'success')));
    } catch (err) {
      // console.log('createCompany \n', err);
    }
  } catch (err) {}
}
