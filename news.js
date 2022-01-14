const {chromium} = require('playwright');
const querystring = require('querystring');

const url = 'https://www.skyscanner.net/news';

(async () => {

    const browser = await chromium.launch({headless: true});

    const page = await browser.newPage();

    await page.goto(url);

    const data = await page.evaluate(() => {
        const content = document.querySelector('.wrap.content.content-archive');

        let items = content.children;

        let text = [];

        for (let key of Object.keys(items)) {
            text[key] = {
                'title': items[key].querySelector('.entry-title').innerText,
                'author': items[key].querySelector('.author.vcard').innerText,
                'img': items[key].querySelector('.post-thumbnail img').getAttribute('src'),
            }

        }

        // for (let i = 0; i < items.length; i++) {
        //     text[i] = items[i].querySelector('.entry-title').innerText;
        // }

        return text;
    });

    await browser.close();

})();