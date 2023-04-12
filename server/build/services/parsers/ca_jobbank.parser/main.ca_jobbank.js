import puppeteer from 'puppeteer';
const homePage = 'https://www.jobbank.gc.ca/home';
const outOfCanadaModal = 'a[onclick*="outOfCanadaCloseBtn"][id="j_id_5i:outOfCanadaCloseBtn"][title="Cancel"]';
const inputPositionSelector = 'input[aria-describedby="what"][name="searchstring"][id="searchString"][placeholder="Example: Cook"]';
const inputCitySelector = 'input#locationstring[name="locationstring"].form-control.input-lg.tt-input[placeholder="Location"]';
const searchButtonSelector = 'button#searchButton.btn.btn-primary[type="submit"]';
const numberOfVacanciesSelector = 'button#searchButton.btn.btn-primary[type="submit"]';
const moreResultsBtnSelector = 'button.btn.btn-default.btn-sm.btn-block#moreresultbutton[onclick="showmore();"]';
const jobListElementSelector = '#ajaxupdateform\\:result_block article a';
let VACANCY_LINKS;
export async function runCaJobankParser(city, position) {
    console.log("I'm parsing city", city);
    console.log("I'm parsing position", position);
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1200,
            height: 900,
        },
    });
    const vacancyPage = await browser.newPage();
    await vacancyPage.goto('https://www.jobbank.gc.ca/jobsearch/jobposting/37924612?source=searchresults%27');
    try {
        await vacancyPage.waitForSelector(outOfCanadaModal, { timeout: 10000 });
        const closeModalButton = await vacancyPage.$(outOfCanadaModal);
        if (closeModalButton) {
            await closeModalButton.click();
        }
    }
    catch (err) {
        console.log(err);
    }
    try {
        console.log('im here');
        const buttonElement = await vacancyPage.$('p > button#applynowbutton');
        if (buttonElement) {
            await buttonElement.click();
        }
    }
    catch (err) {
        console.log(err);
    }
}
//# sourceMappingURL=main.ca_jobbank.js.map