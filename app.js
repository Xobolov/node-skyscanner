const {chromium} = require('playwright');

const url = 'https://www.skyscanner.net/';

(async () => {

    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    const page = await context.newPage();

    // Start tracing before creating / navigating a page.
    await context.tracing.start({ screenshots: true, snapshots: true });

    await page.goto(url);

    await clickInputs(page);

    await browser.startTracing(page, {path: 'trace.json'});

    await page.locator('.BpkButtonBase_bpk-button__NTM4Y').click();

    await page.waitForNavigation();

    await browser.stopTracing();

    let data = await page.evaluate(() => {

        let text = document.querySelector('body').innerText;

        return text;

    });

    // await browser.close();

    console.log(data);

    // Stop tracing and export it into a zip archive.




})();


let clickInputs = async (page) => {

    await page.click('#fsc-origin-search');
    await page.fill('#fsc-origin-search', inputData.origin)

    await page.click('#fsc-destination-search')
    await page.fill('#fsc-destination-search', inputData.destination)
}

let inputData = {

    origin: 'Baku',
    destination: 'Istanbul',

}