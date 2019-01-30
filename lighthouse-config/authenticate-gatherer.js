const Gatherer = require('/usr/local/lib/node_modules/lighthouse').Gatherer;
const puppeteer = require('puppeteer');

// https://github.com/GoogleChrome/lighthouse/issues/3837#issuecomment-345876572
class Authenticate extends Gatherer {
  async beforePass(options) {

    const ws = await options.driver.wsEndpoint();

    const browser = await puppeteer.connect({
      browserWSEndpoint: ws,
     });

    const page = await browser.newPage();
    await page.goto(process.env.TEST_URL);

    await page.click('input[name=username]');
    await page.keyboard.type(process.env.DOG_USER);

    await page.click('input[name=password]');
    await page.keyboard.type(process.env.DOG_PASSWORD);

    // lmao
    await page.click('span[class^=Section__sectionFooterPrimaryContent] button');

    // this means the login succeeded
    await page.waitForSelector('.dashboard');

    // cause i don't want to log in, load assets, and then have them be cached
    // when lighthouse visits this page.
    // await page.setCacheEnabled(false);

    browser.disconnect();
    return {};
  }
}

module.exports = Authenticate;
