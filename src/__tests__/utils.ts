import { Actions, By, Key, ThenableWebDriver, WebElement } from 'selenium-webdriver';
import cypressJson from '../../cypress.json';
import { getLocalIpAdresses } from './network';
import { promises as fsp } from 'fs';
import { TestConfig } from '../test/testEnvConfig';

export interface CellLocation {
    idx: number;
    idy: number;
}

export class Utils {

    private actions!: Actions;
    private lastAssertionResult: 'passed' | 'failed' | undefined;
    public static BASE_URL = cypressJson.baseUrl;
    public static LOCAL_BASE_URL = `${process.env.PROTOCOL}://${getLocalIpAdresses()[0]}:${process.env.PORT}`;
    public static REMOTE_BROSERSTACK_BASE_URL = `${process.env.PROTOCOL}://bs-local.com:${process.env.PORT}`;

    constructor(protected driver: ThenableWebDriver, protected config: TestConfig) {
        this.actions = driver.actions();
    }

    getConfig(): TestConfig {
        return this.config;
    }

    async visit(path = ''): Promise<void> {
        await this.driver.get(Utils.BASE_URL + path);
    }

    async visitLocal(path = ''): Promise<void> {
        await this.driver.get(Utils.LOCAL_BASE_URL + path);
    }

    async visitBrowserStackLocal(path = ''): Promise<void> {
        await this.driver.get(Utils.REMOTE_BROSERSTACK_BASE_URL + path);
    }

    async takeScreenshot(fileName: string): Promise<void> {
        const image = await this.driver.takeScreenshot();
        const path = __dirname + '/screenshots/' + fileName + '.png';
        await fsp.writeFile(path, image, 'base64');
    }

    async writeTextToClipboard(text: string): Promise<unknown> {
        return await this.driver.executeScript('navigator.clipboard.writeText(`' + text + '`);');
    }

    isLastAsserionPassed(): boolean {
        return this.lastAssertionResult === 'passed';
    }

    isTestProd(): boolean {
        return process.env.TEST_PROD === 'true';
    }

    async getOuterInput(): Promise<WebElement> {
        const locator = By.css(`[data-cy="outer-input"]`);
        return await this.driver.findElement(locator);
    }

    async runAssertion(
        assertion: () => any,
        onFailure?: () => any,
    ) {
        try {
            await assertion();
            this.lastAssertionResult = 'passed';
        } catch (exception) {
            if (typeof onFailure === 'function') {
                await onFailure();
            }
            if (this.isTestProd()) {
                await this.driver.close();
                await this.driver.quit();
            }
            this.lastAssertionResult = 'failed';
            throw exception;
        }
    }

    async sendKeys(...key: string[]): Promise<void> {
        const locator = By.className('rg-hidden-element');
        await this.driver.findElement(locator).sendKeys(...key);

        // await actions
        //     .keyDown(Key.META)
        //     .sendKeys('x')
        //     .keyUp(Key.META)
        //     .perform();
    }

    async getCell({ idx, idy }: CellLocation): Promise<WebElement> {
        const locator = By.css(`[data-cell-colidx="${idx}"][data-cell-rowidx="${idy}"]`);
        return await this.driver.findElement(locator);
    }

    async focusCell({ idx, idy }: CellLocation): Promise<WebElement> {
        const cell = await this.getCell({ idx, idy });
        await cell.click();
        return cell;
    }

    /**
     * TODO
     * Implement actions for non Mac OS 
     */
    async copy(): Promise<void> {
        await this.sendKeys(Key.META + 'c');
    }

    async cut(): Promise<void> {
        await this.sendKeys(Key.META + 'x');
    }

    async paste(): Promise<void> {
        await this.sendKeys(Key.META + 'v');
    }

}

 // function runBrowserStackLocal(arg: any) {
//     const local = new browserstack.Local();
//     return new Promise((resolve, reject) => {
//         local.start(arg, function () {
//             if (local.isRunning()) {
//                 resolve(local);
//             }
//             reject();
//         });
//     })
// }
// local = await runBrowserStackLocal(localServerOptions);

// local.stop(function () {
//     console.log('Local server closed');
// });
