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
    const srcs = await page.$$eval("img", elements => {
        elements.forEach(element => {
            if (element.src == "https://club.movistar.cl/media/beneficios/8db71cd5-8539-4e1f-b48b-b89d2ff606d0.jpg" ){
                element.click();
            };
        });
        return elements.map(element => element.src);
    });
    console.log(srcs);
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    // take screenshot
    await page.screenshot({ path: 'screenshot.png' });
    //await page.evaluate((selector) =>  document.querySelector(selector).click(), selector);
    //await page
    await new Promise(r => setTimeout(r, 50000));
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    // Close the browser
    await browser.close();
}

selector = '[src=\'https://club.movistar.cl/media/beneficios/8db71cd5-8539-4e1f-b48b-b89d2ff606d0.jpg\']';
run(selector);


