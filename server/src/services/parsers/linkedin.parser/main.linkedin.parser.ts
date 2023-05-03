import puppeteer from 'puppeteer';

export async function runLinkedinParser() {
  try {
    console.log('lounching');
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: 'example.png' });

    await browser.close();
    console.log('lounched');
  } catch (err) {
    console.log(err);
  }
}
