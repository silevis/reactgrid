import { Builder, Key, ThenableWebDriver } from 'selenium-webdriver';
import { CellLocation, Utils } from '../utils';
import { appiumURL, mobileLocalcapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';

describe('Cell editor', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        driver = new Builder()
            .forBrowser('chrome')
            .usingServer(appiumURL)
            .withCapabilities(mobileLocalcapabilities)
            .build();
        utils = new Utils(driver, config, 'mobileAndroidTablet');
        await utils.wipeScreenshotsDir();
    });

    beforeEach(async () => {
        await utils.visitLocal();
    });

    afterAll(async () => {
        // await driver.quit();
        // await driver.close();
    });

    it('should be rendered inside cell', async () => {

        const source: CellLocation = {
            idx: 0,
            idy: 5,
        }

        const sourceCell = await utils.focusCell(source);
        const text = await sourceCell.getText();
        await utils.sendKeys(Key.RETURN);

        await utils.runAssertion(async () => {
            expect(text).toBe('❯');
        });

    });

});
