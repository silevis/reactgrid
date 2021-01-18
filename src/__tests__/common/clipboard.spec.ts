import { Builder, By, Key, until, Button, ThenableWebDriver } from 'selenium-webdriver';
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

    test('cut and paste', async () => {

        await utils.sendKeys(Key.RETURN);

        await utils.sendKeys(Key.ARROW_RIGHT);
        await utils.copy();
        await utils.sendKeys(Key.ARROW_DOWN);
        await utils.sendKeys(Key.ARROW_DOWN);
        await utils.paste();

        // expect(granted).toBe('granted');
    });

    test('cut with context menu', async () => {

        const actions = driver.actions();

        const selectedCell = await utils.focusCell(4, 4);

        await actions
            .contextClick(selectedCell)
            .perform();

        await utils.openContextMenu(selectedCell);
        await utils.clickContextMenuOption(1);
        const target = await utils.focusCell(2, 8);
        await utils.openContextMenu(target);
        await utils.clickContextMenuOption(2);

    });

    afterAll(async () => {
        // await driver.close();
        // await driver.quit();
    })

});
