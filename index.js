const puppeteer = require("puppeteer");
require("dotenv").config();

// Helper funtions to click on elements by specified text
// Recovered and adapted from: https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
const escapeXpathString = (str) => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

const clickByText = async (page, text) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//*[contains(text(), ${escapedText})]`);

  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};

async function run(contestText) {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  // Create a new page
  const page = await browser.newPage();
  // Go to log in page
  await page.goto(
    "https://acceso.movistar.cl/SSO_AU_WEB/loginAction.do?_ga=2.129519564.1703626475.1669748900-1960901754.1669748900"
  );
  // Type in username
  await page.type("#username", process.env.RUT);
  // Type in password
  await page.type("#password", process.env.PASSWORD);
  // Click on the login button
  await page.click("#botonLogin");
  // Wait for the page to load
  await page.waitForSelector("#card-revisa-consumo");
  // Go to club-movistar page
  await page.goto("https://mi.movistar.cl/svr/#/main/club-movistar");
  // Wait for club-movistar page to load
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  // Wait for iframe
  const elementHandle = await page.waitForSelector(".content-iframe");
  // Get the iframe element
  const frame = await elementHandle.contentFrame();
  // Wait for contest button to load
  await frame.waitForSelector(
    ".ion-no-padding.ion-no-margin.ion-text-center.ion-align-self-center.nv-padding-8.cursePointer.opcion-no-active.md.hydrated"
  );
  // Go to contest list by clicking "Concursos" button
  await frame.click(
    ".ion-no-padding.ion-no-margin.ion-text-center.ion-align-self-center.nv-padding-8.cursePointer.opcion-no-active.md.hydrated"
  );
  // Wait some time for desired contest to load (Just in case)
  await new Promise((r) => setTimeout(r, 500));
  // Scroll to bottom of page
  await page.keyboard.down("End");
  // Wait some time to reach bottom of page (Just in case)
  await new Promise((r) => setTimeout(r, 500));
  // Click on desired contest
  await clickByText(frame, contestText);
  // Wait some time for page to load (Just in case)
  await new Promise((r) => setTimeout(r, 500));
  // Click "Si" button
  const yes_button = await frame.$$(
    "xpath/" +
      "//html/body/app-root/app-concursos/div/concursos-select/ion-content/ion-grid/ion-row/ion-col/div/div/select-group-concurso-club/select-concurso-club/div/ion-row[2]/ion-col/ion-radio-group/div[2]/ion-item"
  );
  await yes_button[0].click();
  // Click "Continuar" button
  const continue_button = await frame.$$(
    "xpath/" +
    "//html/body/app-root/app-concursos/div/concursos-select/ion-content/ion-grid/ion-row/ion-col/div/ion-row[2]/ion-col/button"
  );
  await continue_button[0].click();
  // Wait some time for page to load (Just in case)
  await new Promise((r) => setTimeout(r, 1000));
  // Take screenshot
  await page.screenshot({ path: "screenshot.png" });
  // Close the browser
  await browser.close();
}

contestText = "concurso movistar arena 13 de enero";
run(contestText);
