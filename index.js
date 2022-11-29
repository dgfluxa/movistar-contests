const puppeteer = require('puppeteer');
require('dotenv').config()

async function run() {
    // Launch the browser
    const browser = await puppeteer.launch();
    // Create a new page
    const page = await browser.newPage();
    // Go to log in page
    await page.goto('https://acceso.movistar.cl/SSO_AU_WEB/loginAction.do?_ga=2.129519564.1703626475.1669748900-1960901754.1669748900');
    // Type in username
    await page.type('#username', process.env.RUT);
    // Type in password
    await page.type('#password', process.env.PASSWORD);
    // Click on the login button
    await page.click('#botonLogin');
    // Wait for the page to load
    await page.waitForSelector('#card-revisa-consumo');
    // Take screenshot
    // await page.screenshot({ path: 'movistar_screenshot.png' });
    // Go to club-movistar page
    await page.goto('https://mi.movistar.cl/svr/#/main/club-movistar');
    // Wait for the page to load
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    // Take screenshot
    // await page.screenshot({ path: 'club_movistar_screenshot.png' });
    // Close the browser
    await browser.close();
}

run();