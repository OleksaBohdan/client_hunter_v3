import puppeteer from 'puppeteer';
import { isEmail } from '../../../pkg/validators.js';

// Home page
const homePage = 'https://www.jobbank.gc.ca/home';
const outOfCanadaModal: any = 'a[onclick*="outOfCanadaCloseBtn"][id="j_id_5i:outOfCanadaCloseBtn"][title="Cancel"]';
const inputPositionSelector: any =
  'input[aria-describedby="what"][name="searchstring"][id="searchString"][placeholder="Example: Cook"]';
const inputCitySelector: any =
  'input#locationstring[name="locationstring"].form-control.input-lg.tt-input[placeholder="Location"]';
const searchButtonSelector: any = 'button#searchButton.btn.btn-primary[type="submit"]';
const numberOfVacanciesSelector: any = 'button#searchButton.btn.btn-primary[type="submit"]';
const moreResultsBtnSelector: any = 'button.btn.btn-default.btn-sm.btn-block#moreresultbutton[onclick="showmore();"]';
const jobListElementSelector: any = '#ajaxupdateform\\:result_block article a';
// Vacancy page
const howToapplyBtnSelector: any = 'p > button#applynowbutton';
const emailSelector: any = '#howtoapply p a';
const phoneSelector: any = '#howtoapply p:nth-of-type(2)';
const additionalInfoSelector: any = '#tp_referenceNumber';
const companyNameSelector: any = 'p.date-business span.business span[property="name"] strong';
const postCreatedSelector: any = 'p.date-business span.date';
const vacancyTitleSelector: any = 'h1.title span[property="title"]';

export async function runCaJobankParser(city: string, position: string) {
  const PARALLEL_PAGE = 3;
  let VACANCY_LINKS: string[] = [];

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 900,
    },
  });

  const page = await browser.newPage();
  await page.goto(homePage);

  // close modal
  try {
    await page.waitForSelector(outOfCanadaModal, { timeout: 5000 });
    const closeModalButton = await page.$(outOfCanadaModal);
    if (closeModalButton) {
      await closeModalButton.click();
    }
  } catch (err) {
    console.log(err);
  }

  // enter value - vacancy position
  try {
    await page.waitForSelector(inputPositionSelector);
    const inputPositionElement = await page.$(inputPositionSelector);
    if (inputPositionElement) {
      await inputPositionElement.type(position);
    }
  } catch (err) {
    console.log(err);
  }

  // enter value - city
  try {
    await page.waitForSelector(inputCitySelector);
    const inputCityElement = await page.$(inputCitySelector);
    if (inputCityElement) {
      await inputCityElement.type(city);
    }
  } catch (err) {
    console.log(err);
  }

  // click to search
  try {
    await page.waitForSelector(searchButtonSelector);
    const searchButton = await page.$(searchButtonSelector);
    if (searchButton) {
      await searchButton.click();
    }
  } catch (err) {
    console.log(err);
  }

  // get results number
  try {
    await page.waitForSelector(numberOfVacanciesSelector);
    const numberOfVacancies = await page.$eval('span.found', (element) => element.textContent);
    console.log('numberOfVacancies - ', numberOfVacancies);
    console.log('numberOfVacancies - ', numberOfVacancies);
    console.log('numberOfVacancies - ', numberOfVacancies);
    console.log('numberOfVacancies - ', numberOfVacancies);
    console.log('numberOfVacancies - ', numberOfVacancies);
    console.log('numberOfVacancies - ', numberOfVacancies);
    if (numberOfVacancies === '0') {
      console.log('FINISH - VACANCIES NOT FOUND');
      await browser.close();
      return;
    }
  } catch (err) {
    console.log(err);
  }

  // open list with vacancy links
  async function showAllVanacyLinks() {
    for (let i = 0; i >= 0; i++) {
      try {
        await page.waitForSelector(moreResultsBtnSelector, { timeout: 7000 });
        const moreResultsButton = await page.$(moreResultsBtnSelector);
        if (moreResultsButton) {
          moreResultsButton.click();
        }
      } catch (err) {
        console.log(err);
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  await showAllVanacyLinks();

  // fetch vacancy links
  try {
    const jobListingElements = await page.$$(jobListElementSelector);
    const hrefs = await Promise.all(jobListingElements.map((el) => el.evaluate((a) => a.getAttribute('href'))));
    if (hrefs != null) {
      const filteredHrefs = hrefs.filter((href) => href && !href.includes('/login'));
      const prefixedHrefs = filteredHrefs.map((href) => `https://www.jobbank.gc.ca${href}`);
      VACANCY_LINKS = prefixedHrefs;
    }
  } catch (err) {
    console.log(err);
  }

  await page.close();

  // parsing vacancy pages
  const vacancyPages = [];
  for (let i = 0; i < PARALLEL_PAGE; i++) {
    vacancyPages.push(await browser.newPage());
  }

  for (let i = 0; i < VACANCY_LINKS.length; i += PARALLEL_PAGE) {
    const promises = [];
    for (let j = 0; j < PARALLEL_PAGE && i + j < VACANCY_LINKS.length; j++) {
      promises.push(parseVacancyPage(VACANCY_LINKS[i + j], vacancyPages[j]));
    }
    await Promise.all(promises);
  }

  console.log('FINISH');
  await browser.close();
}

async function parseVacancyPage(link: string, page: puppeteer.Page) {
  try {
    await page.goto(link);

    // click btn - 'HOW TO APPLY'
    try {
      await page.waitForSelector(howToapplyBtnSelector, { timeout: 5000 });
      const buttonElement = await page.$(howToapplyBtnSelector);
      if (buttonElement) {
        await buttonElement.click();
      }
    } catch (err) {
      console.log(err);
    }

    // get email
    try {
      await page.waitForSelector(emailSelector, { timeout: 3000 });
      const email = await page.$eval(emailSelector, (element) => element.textContent);
      const validEmail = isEmail(email);
    } catch (err) {
      console.log(err);
    }

    // get phone
    try {
      const phone = await page.$eval(phoneSelector, (element) => element.textContent?.trim().split('\n')[0]);
    } catch (err) {
      console.log(err);
    }

    // get reference number
    try {
      const referenceNumber = await page.$eval(additionalInfoSelector, (el) =>
        el.previousSibling ? el.previousSibling.textContent?.trim() : null,
      );
    } catch (err) {
      console.log(err);
    }

    // get company name
    try {
      const companyName = await page.$eval(companyNameSelector, (element) => element.textContent);
    } catch (err) {
      console.log(err);
    }

    // get postCreated
    try {
      const datePosted = await page.$eval(postCreatedSelector, (element) => element.textContent);
      if (datePosted) {
        const date = new Date(datePosted);
        const formattedDate = date.toISOString().split('T')[0];
      }
    } catch (err) {
      console.log(err);
    }

    // get Vacancy Job title
    try {
      const jobTitle = await page.$eval(vacancyTitleSelector, (element) => element.textContent);
      const title = jobTitle?.trim();
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
}
