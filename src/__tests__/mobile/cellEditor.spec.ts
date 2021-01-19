import { Builder, Key, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { appiumURL, mobileLocalcapabilities } from '../mobileOptions';

describe('Cell editor', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    beforeAll(async () => {
        driver = new Builder()
            .usingServer(appiumURL)
            .withCapabilities(mobileLocalcapabilities)
            .forBrowser('Chrome')
            .build();

        utils = new Utils(driver);

        await utils.visitLocal();

    }, 30000);

    it('should be rendered inside cell', async () => {
        // throw new Error(`Test not implemented!`);

        await utils.sendKeys(Key.RETURN);

    }, 30000);

    afterAll(async () => {
        // await driver.close();
        // await driver.quit();
    })

});
