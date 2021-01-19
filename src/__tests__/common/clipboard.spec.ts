import { Builder, Key, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { getChromeCapabilities, getOptions } from '../options';

describe('Clipboard', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    beforeAll(async () => {
        driver = new Builder()
            .forBrowser('chrome')
            .withCapabilities(getChromeCapabilities())
            .setChromeOptions(getOptions())
            .build();

        utils = new Utils(driver);

        await utils.visit();
    })

    it('cut and paste', async () => {

        await utils.sendKeys(Key.RETURN);

        await utils.sendKeys(Key.ARROW_RIGHT);
        await utils.copy();
        await utils.sendKeys(Key.ARROW_DOWN);
        await utils.sendKeys(Key.ARROW_DOWN);
        await utils.paste();

        // expect(granted).toBe('granted'); 
    });

    it.skip('cut cell content of all cell templates', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('cut cell with groupId', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('cut cell and then paste content into the same cell template', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('copy cell and paste into corespoding cell template', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('should NOT paste cell into diffrent groupId', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('should paste cell content into outer input', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('should ensure that pasted content becomes ', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('should paste content from other source', async () => {
        throw new Error(`Test not implemented!`);
    });

    afterAll(async () => {
        // await driver.close();
        // await driver.quit();
    })

});
