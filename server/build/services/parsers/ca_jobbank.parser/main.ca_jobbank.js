import puppeteer from 'puppeteer';
import { isEmail, validateCanadaPhone } from '../pkg/validators.js';
import { removeExistingVacancyLinks } from '../pkg/filters.js';
import { Company } from '../../../databases/mongo/models/Company.js';
import { createCompany, readCompaniesEmails } from '../../repositories/company.service.js';
import { readCompaniesVacancyLink } from '../../repositories/company.service.js';
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
const vacancyWebsiteSelector = 'span[property="hiringOrganization"] span[property="name"] a.external';
export async function runCaJobankParser(city, position, user) {
    const PARALLEL_PAGE = 3;
    let VACANCY_LINKS = [];
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1200,
            height: 900,
        },
    });
    const page = await browser.newPage();
    try {
        await page.goto(homePage);
    }
    catch (err) {
        try {
            await page.goto(homePage);
        }
        catch (err) {
            console.log('FINISH');
            await browser.close();
        }
    }
    try {
        await page.waitForSelector(outOfCanadaModal, { timeout: 5000 });
        const closeModalButton = await page.$(outOfCanadaModal);
        if (closeModalButton) {
            await closeModalButton.click();
        }
    }
    catch (err) {
    }
    try {
        await page.waitForSelector(inputPositionSelector);
        const inputPositionElement = await page.$(inputPositionSelector);
        if (inputPositionElement) {
            await inputPositionElement.type(position);
        }
    }
    catch (err) {
    }
    try {
        await page.waitForSelector(inputCitySelector);
        const inputCityElement = await page.$(inputCitySelector);
        if (inputCityElement) {
            await inputCityElement.type(city);
        }
    }
    catch (err) {
    }
    try {
        await page.waitForSelector(searchButtonSelector);
        const searchButton = await page.$(searchButtonSelector);
        if (searchButton) {
            await searchButton.click();
        }
    }
    catch (err) {
    }
    try {
        await page.waitForSelector(numberOfVacanciesSelector);
        const numberOfVacancies = await page.$eval('span.found', (element) => element.textContent);
        if (numberOfVacancies === '0') {
            console.log('FINISH - VACANCIES NOT FOUND');
            await browser.close();
            return;
        }
    }
    catch (err) {
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
    }
    await page.close();
    const existingLinks = await readCompaniesVacancyLink(user);
    VACANCY_LINKS = removeExistingVacancyLinks(VACANCY_LINKS, existingLinks);
    const existingEmails = await readCompaniesEmails(user);
    console.log('existingLinks', existingLinks.length);
    console.log('new VACANCY_LINKS', VACANCY_LINKS.length);
    const vacancyPages = [];
    for (let i = 0; i < PARALLEL_PAGE; i++) {
        vacancyPages.push(await browser.newPage());
    }
    for (let i = 0; i < VACANCY_LINKS.length; i += PARALLEL_PAGE) {
        const promises = [];
        for (let j = 0; j < PARALLEL_PAGE && i + j < VACANCY_LINKS.length; j++) {
            promises.push(parseVacancyPage(VACANCY_LINKS[i + j], vacancyPages[j], user, city, position, existingEmails));
        }
        await Promise.all(promises);
    }
    console.log('FINISH');
    await browser.close();
}
async function parseVacancyPage(link, page, user, positionKeyword, placeKeyword, emails) {
    const newCompany = new Company();
    newCompany.vacancyLink = link;
    newCompany.positionKeyword = positionKeyword;
    newCompany.placeKeyword = placeKeyword;
    try {
        await page.goto(link);
        try {
            await page.waitForSelector(howToapplyBtnSelector, { timeout: 5000 });
            const buttonElement = await page.$(howToapplyBtnSelector);
            if (buttonElement) {
                await buttonElement.click();
            }
        }
        catch (err) {
        }
        try {
            await page.waitForSelector(emailSelector, { timeout: 3000 });
            const email = await page.$eval(emailSelector, (element) => element.textContent);
            const validEmail = isEmail(email);
            if (validEmail != '') {
                if (emails.includes(validEmail)) {
                    return;
                }
                newCompany.email = validEmail;
                newCompany.mailFrom = 'jobsite';
            }
        }
        catch (err) {
        }
        try {
            const phone = await page.$eval(phoneSelector, (element) => { var _a; return (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim().split('\n')[0]; });
            if (validateCanadaPhone(phone) != '') {
                newCompany.phone = validateCanadaPhone(phone);
            }
        }
        catch (err) {
        }
        try {
            const additionalInfo = await page.$eval(additionalInfoSelector, (el) => { var _a; return el.previousSibling ? (_a = el.previousSibling.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null; });
            newCompany.additionalInfo = additionalInfo;
        }
        catch (err) {
        }
        try {
            const companyName = await page.$eval(companyNameSelector, (element) => element.textContent);
            newCompany.name = companyName;
        }
        catch (err) {
        }
        try {
            const website = await page.$eval(vacancyWebsiteSelector, (anchor) => anchor.href);
            newCompany.website = website;
            const companyName = await page.$eval(vacancyWebsiteSelector, (anchor) => anchor.textContent);
            if (companyName) {
                newCompany.name = companyName;
            }
        }
        catch (err) {
        }
        try {
            const datePosted = await page.$eval(postCreatedSelector, (element) => element.textContent);
            if (datePosted) {
                const date = new Date(datePosted);
                newCompany.vacancyDate = date;
            }
        }
        catch (err) {
        }
        try {
            const jobTitle = await page.$eval(vacancyTitleSelector, (element) => element.textContent);
            const title = jobTitle === null || jobTitle === void 0 ? void 0 : jobTitle.trim();
            newCompany.vacancyTitle = title;
        }
        catch (err) {
        }
        try {
            await createCompany(newCompany, user);
        }
        catch (err) {
            console.log(err);
        }
    }
    catch (err) {
    }
}
//# sourceMappingURL=main.ca_jobbank.js.map