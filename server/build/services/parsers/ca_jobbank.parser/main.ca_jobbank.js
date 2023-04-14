import puppeteer from 'puppeteer';
import { isEmail } from '../../../pkg/validators.js';
const homePage = 'https://www.jobbank.gc.ca/home';
const outOfCanadaModal = 'a[onclick*="outOfCanadaCloseBtn"][id="j_id_5i:outOfCanadaCloseBtn"][title="Cancel"]';
const inputPositionSelector = 'input[aria-describedby="what"][name="searchstring"][id="searchString"][placeholder="Example: Cook"]';
const inputCitySelector = 'input#locationstring[name="locationstring"].form-control.input-lg.tt-input[placeholder="Location"]';
const searchButtonSelector = 'button#searchButton.btn.btn-primary[type="submit"]';
const numberOfVacanciesSelector = 'button#searchButton.btn.btn-primary[type="submit"]';
const moreResultsBtnSelector = 'button.btn.btn-default.btn-sm.btn-block#moreresultbutton[onclick="showmore();"]';
const jobListElementSelector = '#ajaxupdateform\\:result_block article a';
const howToapplyBtnSelector = 'p > button#applynowbutton';
const emailSelector = '#howtoapply p a';
const phoneSelector = '#howtoapply p:nth-of-type(2)';
const additionalInfoSelector = '#tp_referenceNumber';
const companyNameSelector = 'p.date-business span.business span[property="name"] strong';
const postCreatedSelector = 'p.date-business span.date';
const vacancyTitleSelector = 'h1.title span[property="title"]';
let VACANCY_LINKS;
let EMAILS;
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
    const page = await browser.newPage();
    await page.goto(homePage);
    try {
        await page.waitForSelector(outOfCanadaModal, { timeout: 5000 });
        const closeModalButton = await page.$(outOfCanadaModal);
        if (closeModalButton) {
            await closeModalButton.click();
        }
    }
    catch (err) {
        console.log(err);
    }
    try {
        await page.waitForSelector(inputPositionSelector);
        const inputPositionElement = await page.$(inputPositionSelector);
        if (inputPositionElement) {
            await inputPositionElement.type('cleaner');
        }
    }
    catch (err) {
        console.log(err);
    }
    try {
        await page.waitForSelector(inputCitySelector);
        const inputCityElement = await page.$(inputCitySelector);
        if (inputCityElement) {
            await inputCityElement.type('Toronto');
        }
    }
    catch (err) {
        console.log(err);
    }
    try {
        await page.waitForSelector(searchButtonSelector);
        const searchButton = await page.$(searchButtonSelector);
        if (searchButton) {
            await searchButton.click();
        }
    }
    catch (err) {
        console.log(err);
    }
    try {
        await page.waitForSelector(numberOfVacanciesSelector);
        const numberOfVacancies = await page.$eval('span.found', (element) => element.textContent);
        console.log(numberOfVacancies);
    }
    catch (err) {
        console.log(err);
    }
    async function showAllVanacyLinks() {
        for (let i = 0; i >= 0; i++) {
            try {
                await page.waitForSelector(moreResultsBtnSelector, { timeout: 7000 });
                const moreResultsButton = await page.$(moreResultsBtnSelector);
                if (moreResultsButton) {
                    moreResultsButton.click();
                }
            }
            catch (err) {
                console.log(err);
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    await showAllVanacyLinks();
    try {
        const jobListingElements = await page.$$(jobListElementSelector);
        const hrefs = await Promise.all(jobListingElements.map((el) => el.evaluate((a) => a.getAttribute('href'))));
        if (hrefs != null) {
            const filteredHrefs = hrefs.filter((href) => href && !href.includes('/login'));
            const prefixedHrefs = filteredHrefs.map((href) => `https://www.jobbank.gc.ca${href}`);
            VACANCY_LINKS = prefixedHrefs;
        }
    }
    catch (err) {
        console.log(err);
    }
    await page.close();
    const vacancyPage1 = await browser.newPage();
    const tmp_Length = 3;
    for (let i = 0; i < tmp_Length; i++) {
        const parser_1 = i;
        const promises = [];
        promises.push(parseVacancyPage(VACANCY_LINKS[parser_1], vacancyPage1));
        await Promise.all(promises);
    }
    console.log(EMAILS);
    console.log(EMAILS.length);
    console.log((EMAILS.length / VACANCY_LINKS.length) * 100, '- % ');
    await browser.close();
}
async function parseVacancyPage(link, page) {
    try {
        console.log(`GO TO LINK: ${link}`);
        await page.goto(link);
        try {
            await page.waitForSelector(howToapplyBtnSelector, { timeout: 5000 });
            const buttonElement = await page.$(howToapplyBtnSelector);
            if (buttonElement) {
                await buttonElement.click();
            }
        }
        catch (err) {
            console.log(err);
        }
        try {
            await page.waitForSelector(emailSelector, { timeout: 3000 });
            const email = await page.$eval(emailSelector, (element) => element.textContent);
            const validEmail = isEmail(email);
            console.log('VALID EMAIL = ', validEmail);
            EMAILS.push(validEmail);
        }
        catch (err) {
            console.log(err);
        }
        try {
            const phone = await page.$eval(phoneSelector, (element) => { var _a; return (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim().split('\n')[0]; });
            console.log(phone);
        }
        catch (err) {
            console.log(err);
        }
        try {
            const referenceNumber = await page.$eval(additionalInfoSelector, (el) => { var _a; return el.previousSibling ? (_a = el.previousSibling.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null; });
            console.log(referenceNumber);
        }
        catch (err) {
            console.log(err);
        }
        try {
            const companyName = await page.$eval(companyNameSelector, (element) => element.textContent);
            console.log(companyName);
        }
        catch (err) {
            console.log(err);
        }
        try {
            const datePosted = await page.$eval(postCreatedSelector, (element) => element.textContent);
            if (datePosted) {
                const date = new Date(datePosted);
                const formattedDate = date.toISOString().split('T')[0];
                console.log(formattedDate);
            }
        }
        catch (err) {
            console.log(err);
        }
        try {
            const jobTitle = await page.$eval(vacancyTitleSelector, (element) => element.textContent);
            console.log(jobTitle === null || jobTitle === void 0 ? void 0 : jobTitle.trim());
        }
        catch (err) {
            console.log(err);
        }
    }
    catch (err) {
        console.log(err);
    }
}
//# sourceMappingURL=main.ca_jobbank.js.map