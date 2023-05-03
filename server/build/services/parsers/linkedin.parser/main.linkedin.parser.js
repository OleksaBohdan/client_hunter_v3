import puppeteer from 'puppeteer';
export async function runLinkedinParser() {
    try {
        console.log('lounching');
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1200,
                height: 900,
            },
        });
        console.log('lounched');
    }
    catch (err) {
        console.log(err);
    }
}
//# sourceMappingURL=main.linkedin.parser.js.map