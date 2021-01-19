import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { appiumURL, mobileLocalcapabilities } from '../mobileOptions';

describe('Scroll', () => {

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
    })

    it.skip('should NOT scroll when focused cell is dragged', async () => {
        throw new Error(`Test not implemented!`);
    });

    afterAll(async () => {
        // await driver.close();
        // await driver.quit();
    })

});
