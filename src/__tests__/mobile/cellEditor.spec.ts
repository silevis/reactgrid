import { Builder, Key, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { appiumURL, mobileLocalcapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';

describe.skip('Cell editor', () => {

    const driver: ThenableWebDriver = new Builder()
        .forBrowser('chrome')
        .usingServer(appiumURL)
        .withCapabilities(mobileLocalcapabilities)
        .build();;
    let utils: Utils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        // TODO REMOVE screenshoots
        utils = new Utils(driver, config);
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

    it('should be rendered inside cell', async () => {
        // throw new Error(`Test not implemented!`);
        await utils.sendKeys(Key.RETURN);
    });

});
