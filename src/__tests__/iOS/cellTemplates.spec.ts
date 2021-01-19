import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { browserstackURL, IpadCapabilities } from '../mobileOptions';

describe('Cell templates', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    beforeAll(async () => {

        driver = new Builder()
            .usingServer(browserstackURL)
            .withCapabilities(IpadCapabilities)
            .build();

        utils = new Utils(driver);

        await utils.visitBrowserStackLocal();

    }, 30000);

    it('pick new date in DateCell', async () => {

        const title = await driver.getTitle();

        // Setting the status of test as 'passed' or 'failed' based on the condition; if title of the web page included 'BrowserStack'
        if (title.includes('ReactGrid MIT')) {
            await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains ReactGrid MIT!"}}');
        } else {
            await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain ReactGrid MIT!"}}');
        }

    }, 30000);

    afterAll(async () => {
        await driver.close();
        await driver.quit();
    })

});
