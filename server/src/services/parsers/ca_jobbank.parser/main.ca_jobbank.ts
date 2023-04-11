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
const resultsBlockSelector: any = '#ajaxupdateform:result_block';

let VACANCY_LINKS: string[];

export async function runCaJobankParser(city: string) {
  console.log("I'm parsing", city);

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
      await inputPositionElement.type('cleaner');
    }
  } catch (err) {
    console.log(err);
  }

  // enter value - city
  try {
    await page.waitForSelector(inputCitySelector);
    const inputCityElement = await page.$(inputCitySelector);
    if (inputCityElement) {
      await inputCityElement.type('Toronto');
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
    console.log(numberOfVacancies);
  } catch (err) {
    console.log(err);
  }

  // open list with vacancy links
  try {
    let i = 0;
    const int = setInterval(async () => {
      i++;
      console.log('wait for btn', i);
      try {
        await page.waitForSelector(moreResultsBtnSelector, { timeout: 7000 });
        const moreResultsButton = await page.$(moreResultsBtnSelector);
        if (moreResultsButton) {
          console.log(moreResultsButton);
          moreResultsButton.click();
        }
      } catch (err) {
        console.log(err);
        clearInterval(int);
        console.log('FINISH ');
      }
    }, 1000);
  } catch (err) {
    console.log(err);
  }

  // collect vacancy links
  try {
    // await page.waitForSelector(resultsBlockSelector, { timeout: 5000 });
    console.log('getting hrefs');
    const jobListingElements = await page.$$('#ajaxupdateform\\:result_block article a');
    const hrefs = await Promise.all(jobListingElements.map((el) => el.evaluate((a) => a.getAttribute('href'))));
    console.log(hrefs);
    console.log('finish getting hrefs');
  } catch (err) {
    console.log(err);
  }
}
// try {

// } catch(err) {
//   console.log(err);
// }

// element.textContent.trim()

// go to main page +
// close modal if exists
// enter value - city
// enter value - position
// click to search
// get results number
// collect vacancy links
// close browser
