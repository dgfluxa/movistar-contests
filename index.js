const puppeteer = require('puppeteer');
require('dotenv').config()

async function run(selector) {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
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
    // Go to club-movistar page
    await page.goto('https://mi.movistar.cl/svr/#/main/club-movistar');
    // Wait for club-movistar page to load
    await page.waitForNavigation({waitUntil: 'networkidle0'});  
    // Wait for iframe
    const elementHandle = await page.waitForSelector('.content-iframe');
    // Get the iframe element
    const frame = await elementHandle.contentFrame();
    // Wait for contest button to load
    await frame.waitForSelector('.ion-no-padding.ion-no-margin.ion-text-center.ion-align-self-center.nv-padding-8.cursePointer.opcion-no-active.md.hydrated'); 
    // Go to contest list by clicking "Concursos" button
    await frame.click('.ion-no-padding.ion-no-margin.ion-text-center.ion-align-self-center.nv-padding-8.cursePointer.opcion-no-active.md.hydrated');
    // Take screenshot
    await page.screenshot({ path: 'screenshot.png' });
    // Close the browser
    await browser.close();
}

selector = 'text/concurso movistar arena 13 de enero';
run(selector);


