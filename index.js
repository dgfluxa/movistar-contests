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
  await page.waitForXPath(`//*[contains(text(), ${escapedText})]`, {
    visible: true,
  });
  const linkHandlers = await page.$x(`//*[contains(text(), ${escapedText})]`);

  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};

async function clearText(page, selector) {
  await page.evaluate((selector) => {
    document.querySelector(selector).value = "";
  }, selector);
}

// Submit Form (form ids change every time)
async function submitForm(page, frame, contestText, time) {
  // Scroll to bottom of page
  await page.keyboard.down("End");
  // Click on desired contest
  await clickByText(frame, contestText);

  // Wait and click "Si" button
  await frame.waitForXPath(
    "//html/body/app-root/app-concursos/div/concursos-select/ion-content/ion-grid/ion-row/ion-col/div/div/select-group-concurso-club/select-concurso-club/div/ion-row[2]/ion-col/ion-radio-group/div[2]/ion-item",
    { visible: true }
  );
  const yes_button = await frame.$$(
    "xpath/" +
      "//html/body/app-root/app-concursos/div/concursos-select/ion-content/ion-grid/ion-row/ion-col/div/div/select-group-concurso-club/select-concurso-club/div/ion-row[2]/ion-col/ion-radio-group/div[2]/ion-item"
  );
  await yes_button[0].click();

  // Wait and click "Continuar" button
  await frame.waitForXPath(
    "//html/body/app-root/app-concursos/div/concursos-select/ion-content/ion-grid/ion-row/ion-col/div/ion-row[2]/ion-col/button",
    { visible: true }
  );
  const continue_button = await frame.$$(
    "xpath/" +
      "//html/body/app-root/app-concursos/div/concursos-select/ion-content/ion-grid/ion-row/ion-col/div/ion-row[2]/ion-col/button"
  );
  await continue_button[0].click();

  // Wait for selector to appear
  await frame.waitForSelector(`#mat-input-${time}`, { visible: true });

  // Empty form
  await clearText(frame, `#mat-input-${time}`);
  await clearText(frame, `#mat-input-${time + 1}`);
  await clearText(frame, `#mat-input-${time + 2}`);
  await clearText(frame, `#mat-input-${time + 3}`);
  await clearText(frame, `#mat-input-${time + 4}`);

  // Fill Form
  // Name
  await frame.type(`#mat-input-${time}`, process.env.NAME);
  // Last Name
  await frame.type(`#mat-input-${time + 1}`, process.env.LAST_NAME);
  // RUT
  await frame.type(`#mat-input-${time + 2}`, process.env.RUT2);
  // Email
  await frame.type(`#mat-input-${time + 3}`, process.env.EMAIL);
  // Phone
  await frame.type(`#mat-input-${time + 4}`, process.env.PHONE);

  // Click "Concursar" button
  const entry_button = await frame.$$(
    "xpath/" +
      "//html/body/app-root/app-concursos/div/formulario-datos-personales/ion-content/ion-grid/ion-row/ion-col/form/div/ion-row[10]/ion-col/button"
  );
  await entry_button[0].click();

  // Return to list of contests
  await frame.waitForXPath(
    "//html/body/app-root/app-concursos/div/concursos-ok/ion-content/ion-grid/ion-row/ion-col/div/ion-row[5]/ion-col[1]/button",
    { visible: true }
  );
  const return_button = await frame.$$(
    "xpath/" +
      "//html/body/app-root/app-concursos/div/concursos-ok/ion-content/ion-grid/ion-row/ion-col/div/ion-row[5]/ion-col[1]/button"
  );
  await return_button[0].click();

  // Wait for contest button to load (go back to list of contests)
  try {
    await frame.waitForSelector(
      ".ion-no-padding.ion-no-margin.ion-text-center.ion-align-self-center.nv-padding-8.cursePointer.opcion-no-active.md.hydrated",
      { visible: true, timeout: 10000 }
    );
  } catch (error) {
    // Catch common error while trying to go back
    console.log(error);
    console.log("Trying again...");
    // Try to click return button again
    const return_button = await frame.$$(
      "xpath/" +
        "//html/body/app-root/app-concursos/div/concursos-ok/ion-content/ion-grid/ion-row/ion-col/div/ion-row[5]/ion-col[1]/button"
    );
    await return_button[0].click();
    // Wait for contest button to load (go back to list of contests)
    await frame.waitForSelector(
      ".ion-no-padding.ion-no-margin.ion-text-center.ion-align-self-center.nv-padding-8.cursePointer.opcion-no-active.md.hydrated",
      { visible: true, timeout: 10000 }
    );
  }
}

// Main function
async function run(amount, contestText) {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS.toLowerCase() === "true",
    defaultViewport: { width: 1080, height: 1080 },
  });
  // Create a new page
  const page = await browser.newPage();

  if (process.env.HEADLESS.toLowerCase() == "true") {
    // Set User Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    );
  }

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
  await page.waitForSelector(".content-revisa-consumo");

  // Go to club-movistar page
  await page.goto("https://mi.movistar.cl/svr/#/main/club-movistar");
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

  // Do for 'amount' times
  for (let i = 0; i < amount; i++) {
    // Find contest and submit form
    await submitForm(page, frame, contestText, i * 5);
    console.log(`Entry N°${i + 1} submitted successfully!\n`);
  }

  // Finished submitting entries
  console.log("Finished submitting entries!");

  // Close the browser
  await browser.close();
}

run(parseInt(process.env.AMOUNT), process.env.CONTEST_TEXT);
