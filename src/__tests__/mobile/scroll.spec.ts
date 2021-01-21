import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { appiumURL, mobileLocalcapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';

describe.skip('Scroll', () => {

    const driver: ThenableWebDriver = new Builder()
        .usingServer(appiumURL)
        .withCapabilities(mobileLocalcapabilities)
        .forBrowser('Chrome')
        .build();;
    let utils: Utils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        // TODO REMOVE screenshoots
        utils = new Utils(driver, config);
    });

    beforeEach(async () => {
        await utils.visitLocal();
    });

    it.skip('should NOT scroll when focused cell is dragged', async () => {
        throw new Error(`Test not implemented!`);
    });

});
