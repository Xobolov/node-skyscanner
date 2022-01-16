const {firefox} = require('playwright');
const querystring = require("querystring");

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

    const itinerariesData = await loadData(json, 'itineraries');
    const segmentData = await loadData(json, 'segments');


    let array = [];
    for await (let key of Object.keys(itinerariesData)) {

        // let id = itineraries.id;

        let pricingOptions = itinerariesData[key].pricing_options;
        let option = []
        for await (let key of Object.keys(pricingOptions)) {

            // let mainAgentId = option.agent_ids;
            // let mainPrice = option.price.amount;

            option = {
                mainAgentId: pricingOptions[key].agent_ids,
                mainPrice: pricingOptions[key]['price']['amount'],
            }


           let items = pricingOptions[key]['items'];


            // console.log(items);

            let itemsArr = [];
            for await (let key of Object.keys(items)) {

                // let subAgentId = item.agent_id;
                // let subPrice = item.price.amount;

                itemsArr = {
                    subAgentId: items[key]['agent_id'],
                    subPrice: items[key]['price']['amount'],
                }

                // console.log();

                // let segmentIds = item.segment_ids
                // for await (let id of segmentIds) {
                //
                //     for await (let segment of segmentData) {
                //
                //         if (id == segment.id) {
                //
                //
                //             let arrival = segment.arrival;
                //             let departure = segment.departure;
                //
                //
                //         }
                //
                //
                //     }
                //
                // }


            }

            option[key] = {
                itemsArr
            }
        }


        array[key] = {
            id: itinerariesData[key].id,
            option
        }
        console.log(array)


    }


    // const item = await items(tickers);


    await browser.close();

    // npx playwright show-trace trace.zip

})();

let inputData = {
    origin: 'Baku',
    destination: 'Istanbul',
}

async function clickInputs(page) {
    await page.click('#fsc-trip-type-selector-one-way');
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

async function loadData(json, property) {
    return json[property];
}

async function tickersFunc(data) {
    let tickers = {}

    await Object.keys(data).forEach(key => {
        tickers[key] = {
            id: data[key]['id'],
            priceOptions: data[key]['pricing_options']
        }
    });
    return tickers
}




