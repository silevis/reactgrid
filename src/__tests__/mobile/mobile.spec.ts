import { Builder, By, Key, until, Button, ThenableWebDriver } from 'selenium-webdriver';
import { Utils, BASE_URL } from '../utils';
import { appiumURL, mobileLocalcapabilities } from '../mobileOptions';

describe('Mobile', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    beforeAll(async () => {
        driver = new Builder()
            .usingServer(appiumURL)
            .withCapabilities(mobileLocalcapabilities)
            .forBrowser('Chrome')
            .build();

        utils = new Utils(driver);

        await driver.get('http://192.168.0.15:3001');
    })

    test('mock', async () => {

        const actions = driver.actions();

        /*   await utils.sendKeys('Hello world!');
  
          await driver.sleep(1000);
          // await utils.sendKeys(Key.RETURN);
  
          const actions = driver.actions();
  
          const cell = await utils.focusCell(2, 5);
  
          await actions
              .doubleClick(cell)
              .perform();
  
          await utils.sendKeys(Key.RETURN); */

        const resizeHandleLocator = By.className('rg-touch-resize-handle');
        const bodyLocator = By.css('body');
        const resizeHandle = await driver.findElement(resizeHandleLocator);
        const body = await driver.findElement(bodyLocator);

        //     .mouseDown(resizeHandle)
        //     .mouseMove(body, {
        //         x: 200,
        //         y: 200,
        //     })
        //     .mouseUp(body)
        //     .perform();


    }, 30000);

    afterAll(async () => {
        // await driver.close();
        // await driver.quit();
    })

});
