import { Builder, Key, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { appiumURL, mobileLocalcapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';

describe.skip('Cell editor', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        driver = new Builder()
            .forBrowser('chrome')
            .usingServer(appiumURL)
            .withCapabilities(mobileLocalcapabilities)
            .build();
        utils = new Utils(driver, config, 'mobileIPad');
        await utils.wipeScreenshotsDir();
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
