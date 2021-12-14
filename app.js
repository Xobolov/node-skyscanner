const {chromium} = require('playwright');

const url = 'https://www.skyscanner.net/';

(async () => {

    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);


    await page.locator('.BpkButtonBase_bpk-button__NTM4Y').click();

    await page.waitForNavigation();

    let data = await page.evaluate(() => {

        let text = document.querySelector('body').innerText;

        return text;

    });

    await browser.close();

    console.log(data);

})();