import { By, Key, ThenableWebDriver, WebElement } from 'selenium-webdriver';
import cypressJson from '../../cypress.json';
import { getLocalIpAdresses } from './network';
import { promises as fsp } from 'fs';
import { TestConfig } from '../test/testEnvConfig';

export interface CellLocation {
    idx: number;
    idy: number;
}

export type TestedBrowsers = 'desktopSafari' | 'desktopChrome' | 'mobileIPad' | 'mobileAndroidTablet';

export class Utils {

    private lastAssertionResult: 'passed' | 'failed' | undefined;
    public static BASE_URL = cypressJson.baseUrl;
    public static LOCAL_BASE_URL = `${process.env.PROTOCOL}://${getLocalIpAdresses()[0]}:${process.env.PORT}`;
    public static REMOTE_BROSERSTACK_BASE_URL = `${process.env.PROTOCOL}://bs-local.com:${process.env.PORT}`;
    public static SCREENSHOT_DIR_PATH = __dirname + '/screenshots';

    constructor(
        protected driver: ThenableWebDriver,
        protected config: TestConfig,
        protected testedBrowser: TestedBrowsers,
    ) { }

    getConfig(): TestConfig {
        return this.config;
    }

    public getTestedBrowser(): TestedBrowsers {
        return this.testedBrowser;
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
        const path = Utils.SCREENSHOT_DIR_PATH + '/' + fileName + '.png';
        await fsp.writeFile(path, image, 'base64');
    }

    async wipeScreenshotsDir(): Promise<void> {
        const path = Utils.SCREENSHOT_DIR_PATH;
        await fsp.rmdir(path, { recursive: true });
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
        await this.driver.sleep(200);
        return cell;
    }

    async scrollTo(left: number, top: number) {
        await this.driver.executeScript(`document.getElementsByClassName("test-grid-container")[0].scrollTo(${left},${top});`);
        (await this.driver).sleep(1000);
    }

    /**
     * TODO
     * 1. Implement actions for non Mac OS opearing systems
     */
    async copy(): Promise<void> {
        if (this.testedBrowser === 'desktopSafari') {
            await this.driver.actions()
                .keyDown(Key.META)
                .keyDown('c')
                .keyUp('c')
                .keyUp(Key.META)
                .perform();
            await this.driver.actions().clear();
        } else {
            await this.sendKeys(Key.META + 'c');
        }
        // await this.driver.sleep(200);
    }

    async cut(): Promise<void> {
        if (this.testedBrowser === 'desktopSafari') {
            await this.driver.actions()
                .keyDown(Key.META)
                .keyDown('x')
                .keyUp('x')
                .keyUp(Key.META)
                .perform();
            await this.driver.actions().clear();
        } else {
            await this.sendKeys(Key.META + 'x');
        }
        // await this.driver.sleep(200);
    }

    async paste(): Promise<void> {
        if (this.testedBrowser === 'desktopSafari') {
            await this.driver.actions()
                .keyDown(Key.COMMAND)
                .keyDown('v')
                .keyUp('v')
                .keyUp(Key.COMMAND)
                .perform();
            await this.driver.actions().clear();
        } else {
            await this.sendKeys(Key.META + 'v');
        }
        // await this.driver.sleep(200);
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
