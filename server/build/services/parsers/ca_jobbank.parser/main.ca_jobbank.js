import puppeteer from 'puppeteer';
import { isEmail, validateCanadaPhone } from '../pkg/validators.js';
import { removeExistingVacancyLinks } from '../pkg/filters.js';
import { Company } from '../../../databases/mongo/models/Company.js';
import { createCompany, readCompaniesEmails } from '../../repositories/company.service.js';
import { readCompaniesVacancyLink } from '../../repositories/company.service.js';
import { stopFlags } from '../../../controllers/startParser.controller.js';
import { socketMessage } from '../../../websocket/websocket.js';
import { clients } from '../../../websocket/websocket.js';
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
export async function runCaJobankParser(user, city, position) {
    const PARALLEL_PAGE = 3;
    let VACANCY_LINKS = [];
    const socket = clients[user._id.toString()];
    stopFlags.set(user._id.toString(), false);
    socket.send(JSON.stringify(socketMessage('Lounching parser...', 'regular')));
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
            width: 1200,
            height: 900,
        },
    });
    async function process() {
        if (stopFlags.get(user._id.toString())) {
            socket.send(JSON.stringify(socketMessage('STOP', 'regular')));
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
    }
    catch (err) {
        socket.send(JSON.stringify(socketMessage(`Parser terminated unexpectedly. Please, try again`, 'error')));
        stopFlags.delete(user._id.toString());
        await browser.close();
    }
    try {
        await page.waitForSelector(outOfCanadaModal, { timeout: 7000 });
        const closeModalButton = await page.$(outOfCanadaModal);
        if (closeModalButton) {
            socket.send(JSON.stringify(socketMessage(`Closing bad modal...`, 'regular')));
            await closeModalButton.click();
        }
    }
    catch (err) { }
    try {
        await page.waitForSelector(inputPositionSelector);
        const inputPositionElement = await page.$(inputPositionSelector);
        if (inputPositionElement) {
            await inputPositionElement.type(position);
        }
    }
    catch (err) { }
    try {
        await page.waitForSelector(inputCitySelector);
        const inputCityElement = await page.$(inputCitySelector);
        if (inputCityElement) {
            await inputCityElement.type(city);
        }
    }
    catch (err) { }
    try {
        socket.send(JSON.stringify(socketMessage(`Seraching vacancies...`, 'regular')));
        await page.waitForSelector(searchButtonSelector);
        const searchButton = await page.$(searchButtonSelector);
        if (searchButton) {
            await searchButton.click();
        }
    }
    catch (err) { }
    try {
        await page.waitForSelector(numberOfVacanciesSelector);
        const numberOfVacancies = await page.$eval('span.found', (element) => element.textContent);
        socket.send(JSON.stringify(socketMessage(`Found ${numberOfVacancies} vacancies`, 'success')));
        if (numberOfVacancies === '0') {
            socket.send(JSON.stringify(socketMessage(`FINISH - VACANCIES NOT FOUND`, 'warning')));
            stopFlags.delete(user._id.toString());
            await browser.close();
            return;
        }
    }
    catch (err) { }
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
    catch (err) { }
    await page.close();
    const existingLinks = await readCompaniesVacancyLink(user);
    VACANCY_LINKS = removeExistingVacancyLinks(VACANCY_LINKS, existingLinks);
    const existingEmails = await readCompaniesEmails(user);
    socket.send(JSON.stringify(socketMessage(`Found new vacancies: ${VACANCY_LINKS.length}`, 'success')));
    const vacancyPages = [];
    for (let i = 0; i < PARALLEL_PAGE; i++) {
        vacancyPages.push(await browser.newPage());
    }
    for (let i = 0; i < VACANCY_LINKS.length; i += PARALLEL_PAGE) {
        socket.send(JSON.stringify(socketMessage(`${(i / VACANCY_LINKS.length) * 100}`, 'progress')));
        const promises = [];
        for (let j = 0; j < PARALLEL_PAGE && i + j < VACANCY_LINKS.length; j++) {
            promises.push(parseVacancyPage(VACANCY_LINKS[i + j], vacancyPages[j], user, position, city, existingEmails, socket));
        }
        await Promise.all(promises);
    }
    socket.send(JSON.stringify(socketMessage(`${100}`, 'progress')));
    socket.send(JSON.stringify(socketMessage(`Check the Whitelist for email results and the Greylist for email non-existence.`, 'success')));
    socket.send(JSON.stringify(socketMessage(`Parser has finished work`, 'success')));
    stopFlags.delete(user._id.toString());
    await browser.close();
}
async function parseVacancyPage(link, page, user, positionKeyword, placeKeyword, emails, socket) {
    const newCompany = new Company();
    newCompany.vacancyLink = link;
    newCompany.positionKeyword = positionKeyword;
    newCompany.placeKeyword = placeKeyword;
    try {
        await page.goto(link);
        socket.send(JSON.stringify(socketMessage(`Go to vacancy ${link}`, 'regular')));
        try {
            await page.waitForSelector(howToapplyBtnSelector, { timeout: 5000 });
            const buttonElement = await page.$(howToapplyBtnSelector);
            if (buttonElement) {
                await buttonElement.click();
            }
        }
        catch (err) { }
        try {
            await page.waitForSelector(emailSelector, { timeout: 3000 });
            const email = await page.$eval(emailSelector, (element) => element.textContent);
            const validEmail = isEmail(email);
            if (validEmail != '') {
                if (emails.includes(validEmail)) {
                    socket.send(JSON.stringify(socketMessage(`Email from ${link} already exists in company list.`, 'warning')));
                    return;
                }
                socket.send(JSON.stringify(socketMessage(`Found new email!`, 'success')));
                newCompany.email = validEmail;
                newCompany.mailFrom = 'jobsite';
            }
        }
        catch (err) { }
        try {
            const phone = await page.$eval(phoneSelector, (element) => { var _a; return (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim().split('\n')[0]; });
            if (validateCanadaPhone(phone) != '') {
                newCompany.phone = validateCanadaPhone(phone);
            }
        }
        catch (err) { }
        try {
            const additionalInfo = await page.$eval(additionalInfoSelector, (el) => { var _a; return el.previousSibling ? (_a = el.previousSibling.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null; });
            newCompany.additionalInfo = additionalInfo;
        }
        catch (err) { }
        try {
            const companyName = await page.$eval(companyNameSelector, (element) => element.textContent);
            if (!companyName) {
                return;
            }
            newCompany.name = companyName.trim();
        }
        catch (err) { }
        try {
            const website = await page.$eval(vacancyWebsiteSelector, (anchor) => anchor.href);
            newCompany.website = website;
            const companyName = await page.$eval(vacancyWebsiteSelector, (anchor) => anchor.textContent);
            if (companyName) {
                newCompany.name = companyName;
            }
        }
        catch (err) { }
        try {
            const datePosted = await page.$eval(postCreatedSelector, (element) => element.textContent);
            if (datePosted) {
                const date = new Date(datePosted);
                newCompany.vacancyDate = date;
            }
        }
        catch (err) { }
        try {
            const jobTitle = await page.$eval(vacancyTitleSelector, (element) => element.textContent);
            const title = jobTitle === null || jobTitle === void 0 ? void 0 : jobTitle.trim();
            newCompany.vacancyTitle = title;
        }
        catch (err) { }
        try {
            await createCompany(newCompany, user);
        }
        catch (err) { }
    }
    catch (err) { }
}
//# sourceMappingURL=main.ca_jobbank.js.map