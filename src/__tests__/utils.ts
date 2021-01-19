import { Actions, By, Key, ThenableWebDriver, WebElement } from 'selenium-webdriver';
import cypressJson from '../../cypress.json';
import jest from '../../jest.config';
import { getLocalIpAdresses } from './network';

export class Utils {

    public actions!: Actions;
    public static BASE_URL = cypressJson.baseUrl;
    public static LOCAL_BASE_URL = `${jest.PROTOCOL}://${getLocalIpAdresses()[0]}:${jest.PORT}`;

    constructor(protected driver: ThenableWebDriver) {
        this.actions = driver.actions();
    }

    async visit(path = ''): Promise<void> {
        await this.driver.get(Utils.BASE_URL + path);
    }

    async visitLocal(path = ''): Promise<void> {
        await this.driver.get(Utils.LOCAL_BASE_URL + path);
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

    async focusCell(idx: number, idy: number): Promise<WebElement> {
        const locator = By.css(`[data-cell-colidx="${idx}"][data-cell-rowidx="${idy}"]`);
        const cell = await this.driver.findElement(locator);
        await cell.click();
        return cell;
    }

    async openContextMenu(element: WebElement): Promise<void> {
        await this.actions
            .contextClick(element)
            .perform();
    }

    async clickContextMenuOption(idx: number): Promise<void> {
        const locator = By.className('rg-context-menu-option');
        const ctxOptions = await this.driver.findElements(locator);
        const cutOption = await ctxOptions[idx];
        await cutOption.click();
    }

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
