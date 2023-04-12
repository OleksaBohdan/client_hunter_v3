import puppeteer from 'puppeteer';

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

const howToapplyBtnSelector: any = 'p > button#applynowbutton';
const emailSelector: any = '#howtoapply p a';
const phoneSelector: any = '#howtoapply p:nth-of-type(2)';
const companyNameSelector: any = 'p.date-business span.business span[property="name"] strong';
const postCreatedSelector: any = 'p.date-business span.date';
const vacancyTitleSelector: any = 'h1.title span[property="title"]';

let VACANCY_LINKS: string[];

export async function runCaJobankParser(city: string, position: string) {
  console.log("I'm parsing city", city);
  console.log("I'm parsing position", position);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 900,
    },
  });
  // const page = await browser.newPage();
  // await page.goto(homePage);

  // close modal
  // try {
  //   await page.waitForSelector(outOfCanadaModal, { timeout: 5000 });
  //   const closeModalButton = await page.$(outOfCanadaModal);
  //   if (closeModalButton) {
  //     await closeModalButton.click();
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // enter value - vacancy position
  // try {
  //   await page.waitForSelector(inputPositionSelector);
  //   const inputPositionElement = await page.$(inputPositionSelector);
  //   if (inputPositionElement) {
  //     await inputPositionElement.type('cleaner');
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // enter value - city
  // try {
  //   await page.waitForSelector(inputCitySelector);
  //   const inputCityElement = await page.$(inputCitySelector);
  //   if (inputCityElement) {
  //     await inputCityElement.type('Toronto');
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // click to search
  // try {
  //   await page.waitForSelector(searchButtonSelector);
  //   const searchButton = await page.$(searchButtonSelector);
  //   if (searchButton) {
  //     await searchButton.click();
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // get results number
  // try {
  //   await page.waitForSelector(numberOfVacanciesSelector);
  //   const numberOfVacancies = await page.$eval('span.found', (element) => element.textContent);
  //   console.log(numberOfVacancies);
  // } catch (err) {
  //   console.log(err);
  // }

  // open list with vacancy links
  // async function showAllVanacyLinks() {
  //   for (let i = 0; i >= 0; i++) {
  //     try {
  //       await page.waitForSelector(moreResultsBtnSelector, { timeout: 7000 });
  //       const moreResultsButton = await page.$(moreResultsBtnSelector);
  //       if (moreResultsButton) {
  //         moreResultsButton.click();
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       break;
  //     }
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //   }
  // }
  // await showAllVanacyLinks();

  // fetch vacancy links
  // try {
  //   const jobListingElements = await page.$$(jobListElementSelector);
  //   const hrefs = await Promise.all(jobListingElements.map((el) => el.evaluate((a) => a.getAttribute('href'))));
  //   if (hrefs != null) {
  //     const filteredHrefs = hrefs.filter((href) => href && !href.includes('/login'));
  //     const prefixedHrefs = filteredHrefs.map((href) => `https://www.jobbank.gc.ca${href}`);
  //     VACANCY_LINKS = prefixedHrefs;
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // await page.close();

  // console.log('VACANCY_LINKS', VACANCY_LINKS);

  // go for each link and parse data
  // VACANCY_LINKS.forEach(link => {

  // })
  const vacancyPage = await browser.newPage();
  await vacancyPage.goto('https://www.jobbank.gc.ca/jobsearch/jobposting/37924612?source=searchresults%27');
  // temp
  try {
    await vacancyPage.waitForSelector(outOfCanadaModal, { timeout: 10000 });
    const closeModalButton = await vacancyPage.$(outOfCanadaModal);
    if (closeModalButton) {
      await closeModalButton.click();
    }
  } catch (err) {
    console.log(err);
  }
  // temp
  // click btn - 'HOW TO APPLY'
  try {
    await vacancyPage.waitForSelector(howToapplyBtnSelector);
    const buttonElement = await vacancyPage.$(howToapplyBtnSelector);
    if (buttonElement) {
      await buttonElement.click();
    }
  } catch (err) {
    console.log(err);
  }

  // get email
  try {
    await vacancyPage.waitForSelector(emailSelector);
    const email = await vacancyPage.$eval(emailSelector, (element) => element.textContent);
    console.log(email);
  } catch (err) {
    console.log(err);
  }

  // get phone
  try {
    const phone = await vacancyPage.$eval(phoneSelector, (element) => element.textContent?.trim().split('\n')[0]);
    console.log(phone);
  } catch (err) {
    console.log(err);
  }

  // get company name
  try {
    const companyName = await vacancyPage.$eval(companyNameSelector, (element) => element.textContent);
    console.log(companyName);
  } catch (err) {
    console.log(err);
  }

  // get postCreated
  try {
    const datePosted = await vacancyPage.$eval(postCreatedSelector, (element) => element.textContent);
    if (datePosted) {
      const date = new Date(datePosted);
      const formattedDate = date.toISOString().split('T')[0];
      console.log(formattedDate);
    }
  } catch (err) {
    console.log(err);
  }

  // get Vacancy Job title
  try {
    const jobTitle = await vacancyPage.$eval(vacancyTitleSelector, (element) => element.textContent);
    console.log(jobTitle?.trim());
  } catch (err) {
    console.log(err);
  }

  // getAdditionalInfo
  try {
    const additionalInfo = await vacancyPage.$eval('#howtoapply p:nth-of-type(4)', (element) => element.textContent);
    console.log(additionalInfo?.trim());
  } catch (err) {
    console.log(err);
  }
}

// try {

// } catch(err) {
//   console.log(err);
// }

// go to main page +
// close modal if exists
// enter value - city
// enter value - position
// click to search
// get results number
// collect vacancy links
// close browser
// go for each link and parse data
