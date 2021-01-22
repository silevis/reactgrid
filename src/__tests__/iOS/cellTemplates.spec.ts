import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { browserstackURL, IpadCapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';

describe.skip('Cell templates', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        // TODO REMOVE screenshoots
        driver = new Builder()
            .forBrowser('chrome')
            .usingServer(browserstackURL)
            .withCapabilities(IpadCapabilities)
            .build();
        utils = new Utils(driver, config, 'mobileIPad');
    });

    beforeEach(async () => {
        await utils.visitBrowserStackLocal();
    });

    afterAll(async () => {
        const nonProductionAndSuccess = !utils.isTestProd() && utils.isLastAsserionPassed();
        if (nonProductionAndSuccess) {
            if (await (await driver.getSession()).getId()) {
                await driver.close();
                await driver.quit();
            }
        }
    });

    it('pick new date in DateCell', async () => {

        const title = await driver.getTitle();

        // Setting the status of test as 'passed' or 'failed' based on the condition; if title of the web page included 'BrowserStack'
        if (title.includes('ReactGrid MIT')) {
            await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains ReactGrid MIT!"}}');
        } else {
            await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain ReactGrid MIT!"}}');
        }

    });

});
