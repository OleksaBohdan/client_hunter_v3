import puppeteer from 'puppeteer';
import { isEmail } from '../pkg/validators.js';
import { removeExistingVacancyLinks } from '../pkg/filters.js';
import { Company } from '../../../databases/mongo/models/Company.js';
import { createCompany, readCompaniesEmails } from '../../repositories/company.service.js';
import { readCompaniesVacancyLink } from '../../repositories/company.service.js';
import { stopFlags } from '../../../controllers/startParser.controller.js';
import { socketMessage } from '../../../websocket/websocket.js';
import { clients } from '../../../websocket/websocket.js';
function vacanciesPage(position, city, page) {
    return `https://www.xing.com/jobs/search?country=de.02516e&keywords=${position}&location=${city}&page=${page}`;
}
const vacancyLinkSelector = 'a.list-item-job-teaser-list-item-listItem-f04c772e';
const stopSelector = 'h2.sc-1gpssxl-0.bsVIlR.sc-100kd7l-1.eLOnrY[data-xds="Headline"]';
const companyNameSelector = 'div[data-testid="header-company-info"] h2';
const companyIndustrySelector = 'li[data-testid="info-icon"] svg[data-xds="IconIndustries"]';
const vacancyTitleSelector = 'div.titlestyles__TitleContainer-bl83l1-3 h1[data-testid="job-title"]';
const publishedDateSelector = 'p[data-testid="published-date"]';
const companyLinkSelector = 'div[data-testid="header-company-info"] a[data-testid="company-logo-link"]';
const employeesCountSelector = 'div.EntityInfo-EntityInfo-entityInfoBlockWrapper-d20bbe9a div.EntityInfo-EntityInfo-hideBorderOnLowRes-de1e9fc9 p[data-xds="BodyCopy"] span.EntityInfo-EntityInfo-entityInfoBlockValue-aaacef7d';
const addressSelector = 'div.locations-Location-addressWrapper-e0891ff2[data-testid="locations-address-card"] p.locations-Location-address-aa54f5ed';
const emailSelector = 'div.locations-Location-addressWrapper-e0891ff2 a[href^="mailto:"]';
const websiteSelector = 'div.locations-Location-addressWrapper-e0891ff2 div.locations-Location-websiteLink-e29143d7 a[href^="http"]';
const phoneNumberSelector = 'a[href^="tel:"]';
export async function runXingParser(user, city, position) {
    const PARALLEL_PAGE = 3;
    let VACANCY_LINKS = [];
    let socket = clients[user._id.toString()];
    stopFlags.set(user._id.toString(), false);
    socket.send(JSON.stringify(socketMessage('Lounching parser...', 'regular')));
    const browser = await puppeteer.launch({
        headless: true,
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
    socket.send(JSON.stringify(socketMessage('Calculating vacancies...', 'regular')));
    for (let i = 1; true; i++) {
        try {
            await page.goto(vacanciesPage(position, city, i));
            await page.waitForSelector(vacancyLinkSelector);
            const stopElement = await page.$(stopSelector);
            if (!stopElement) {
                const hrefs = await page.$$eval(vacancyLinkSelector, (links) => {
                    return links.map((link) => link.href);
                });
                VACANCY_LINKS.push(...hrefs);
            }
            else {
                socket.send(JSON.stringify(socketMessage(`Found ${VACANCY_LINKS.length} vacancies`, 'success')));
                break;
            }
        }
        catch (err) {
            console.log(err);
            break;
        }
    }
    const existingLinks = await readCompaniesVacancyLink(user);
    console.log('existingLinks', existingLinks.length);
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
    try {
        await page.goto(link);
        socket.send(JSON.stringify(socketMessage(`Go to vacancy ${link}`, 'regular')));
        const newCompany = new Company();
        newCompany.vacancyLink = link;
        newCompany.positionKeyword = positionKeyword;
        newCompany.placeKeyword = placeKeyword;
        try {
            const companyNameElement = await page.$(companyNameSelector);
            if (companyNameElement) {
                const companyName = await page.evaluate((element) => element.textContent, companyNameElement);
                if (companyName) {
                    newCompany.name = companyName === null || companyName === void 0 ? void 0 : companyName.trim();
                }
            }
        }
        catch (err) { }
        try {
            const companyIndustryElement = await page.$(companyIndustrySelector);
            if (companyIndustryElement) {
                const industryTextElement = await companyIndustryElement.$x('..');
                if (industryTextElement.length > 0) {
                    const industryText = await page.evaluate((element) => element.textContent, industryTextElement[0]);
                    if (industryText) {
                        newCompany.industry = industryText.trim();
                    }
                }
            }
        }
        catch (err) { }
        try {
            const vacancyTitleElement = await page.$(vacancyTitleSelector);
            if (vacancyTitleElement) {
                const vacancyTitle = await page.evaluate((element) => element.textContent, vacancyTitleElement);
                if (vacancyTitle) {
                    newCompany.vacancyTitle = vacancyTitle.trim();
                }
            }
        }
        catch (err) { }
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
        }
        catch (err) { }
        let companyDataLink;
        try {
            const companyLinkElement = await page.$(companyLinkSelector);
            if (companyLinkElement) {
                companyDataLink = await page.evaluate((element) => element.getAttribute('href'), companyLinkElement);
            }
        }
        catch (err) { }
        if (!companyDataLink) {
            return;
        }
        try {
            await page.goto(companyDataLink);
        }
        catch (err) {
            return;
        }
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
        }
        catch (err) { }
        try {
            const addressElement = await page.$(addressSelector);
            if (addressElement) {
                const companyAddress = await page.evaluate((element) => element.textContent, addressElement);
                if (companyAddress) {
                    newCompany.address = companyAddress;
                }
            }
        }
        catch (err) { }
        try {
            const emailElement = await page.$(emailSelector);
            if (emailElement) {
                const companyEmail = await page.evaluate((element) => element.textContent, emailElement);
                if (companyEmail) {
                    const validEmail = isEmail(companyEmail);
                    if (validEmail != '') {
                        if (emails.includes(validEmail)) {
                            socket.send(JSON.stringify(socketMessage(`Email already exists from ${link}.`, 'warning')));
                        }
                        else {
                            newCompany.email = validEmail;
                            newCompany.mailFrom = 'jobsite';
                        }
                    }
                }
            }
        }
        catch (err) { }
        try {
            const websiteElement = await page.$(websiteSelector);
            if (websiteElement) {
                const companyWebsite = await page.evaluate((element) => element.textContent, websiteElement);
                if (companyWebsite) {
                    newCompany.website = companyWebsite;
                }
            }
        }
        catch (err) { }
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
        }
        catch (err) { }
        try {
            await createCompany(newCompany, user);
            socket.send(JSON.stringify(socketMessage(`Found new company!`, 'success')));
        }
        catch (err) {
            console.log('createCompany \n', err);
        }
    }
    catch (err) { }
}
//# sourceMappingURL=main.de_xing.js.map