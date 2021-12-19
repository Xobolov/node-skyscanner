const {firefox} = require('playwright');

const url = 'https://www.skyscanner.net/';

(async () => {

    const browser = await firefox.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);

    await clickInputs(page);

    await page.locator('.BpkButtonBase_bpk-button__NTM4Y').click();

    await page.waitForNavigation();

    const json = await getNetworkEvents(page);

    const itineraries = await itinerariesFunc(json);

    const tickers = await tickersFunc(itineraries);

    console.log(tickers);

    await browser.close();

    // npx playwright show-trace trace.zip

})();

let inputData = {
    origin: 'Baku',
    destination: 'Istanbul',
}

async function clickInputs(page) {
    await page.click('#fsc-origin-search');
    await page.fill('#fsc-origin-search', inputData.origin)

    await page.click('#fsc-destination-search')
    await page.fill('#fsc-destination-search', inputData.destination)
}

async function getNetworkEvents(page) {
    const [response] = await Promise.all([
        page.waitForResponse('**/g/conductor/v1/**'),
    ]);
    // console.log(typeof response);
    return response.json();
}

async function itinerariesFunc(jsonData) {
    return jsonData['itineraries'];
}

async function tickersFunc(data) {
    let tickers = {}

    Object.keys(data).forEach(key => {
        tickers[key] = {
            id: data[key]['id'],
            priceOptions: data[key]['pricing_options']
        }
    });
    return tickers
}
