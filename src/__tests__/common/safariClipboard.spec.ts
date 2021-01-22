import { Builder, By, Key, ThenableWebDriver, WebElement } from 'selenium-webdriver';
import { CellLocation, Utils } from '../utils';
import { getSafariCapabilities } from '../options';
import { config } from '../../test/testEnvConfig';

describe('Safari clipboard', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        driver = new Builder()
            .forBrowser('safari')
            .withCapabilities(getSafariCapabilities())
            .build();
        utils = new Utils(driver, config, 'desktopSafari');
        await utils.wipeScreenshotsDir();
    });

    beforeEach(async () => {
        await utils.visit();
    });

    afterAll(async () => {
        await driver.close();
        await driver.quit();
    });

    it('cut cell content of all cell templates', async () => { // ✅
        let source: CellLocation = {
            idx: 0,
            idy: 5,
        }

        let sourceCell: WebElement;

        sourceCell = await utils.focusCell(source);
        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toBe('❯');
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toBe('');
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toBe('');
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toBe('');
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toBe('');
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toBe('');
        });

        // Checkbox
        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        const checkboxInput = await sourceCell.findElement(By.css('input'));
        const isChecked = await checkboxInput.isSelected();
        await utils.runAssertion(async () => {
            expect(isChecked).toBe(true);
        });
        await utils.sendKeys(Key.SPACE);
        const checkboxInputAfterUncheck = await sourceCell.findElement(By.css('input'));
        const isCheckedUncheck = await checkboxInputAfterUncheck.isSelected();
        await utils.runAssertion(async () => {
            expect(isCheckedUncheck).toBe(false);
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toMatch(/^A|B|$/); // in this case cell has groupId inside
        });

        // Dropdown test should be implemented as separate test
    });

    it.skip('cut on Dropdown cell', async () => {
        // 🟠 TODO fix
        let source: CellLocation = {
            idx: 8,
            idy: 5,
        }

        let sourceCell: WebElement;
        sourceCell = await utils.focusCell(source);
        const reactDropdownOption = await driver.findElement(By.id('react-select-4-option-0'));
        reactDropdownOption.click();
        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toBe('React');
        });

        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await sourceCell.getText()).toBe('Select...');
        });
    });

    it('cut cell with groupId', async () => { // ✅
        let sourceCell = await utils.focusCell({
            idx: 0,
            idy: 3,
        });
        await utils.cut();

        // this line break is necessary
        await utils.runAssertion(async () => {
            expect(await (await sourceCell.getText())).toContain(`❯A`);
        });

        sourceCell = await utils.focusCell({
            idx: 1,
            idy: 6,
        });
        await utils.cut();

        await utils.runAssertion(async () => {
            expect(await (await sourceCell.getText())).toContain(`B`);
        });

    });

    it('cut cell and paste into corresponding cell template', async () => { // ✅
        let source: CellLocation = {
            idx: 0,
            idy: 4,
        }

        let sourceCell: WebElement;
        let targetCell: WebElement;
        let sourceCellContent: string;

        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.cut();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.cut();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.cut();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.cut();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.cut();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.cut();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });


        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        const checkboxInput = await sourceCell.findElement(By.css('input'));
        const isChecked = await checkboxInput.isSelected();
        await utils.runAssertion(async () => {
            expect(isChecked).toBe(true);
        });
        await utils.cut();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        const targetInputCheckbox = await targetCell.findElement(By.css('input'));
        await utils.runAssertion(async () => {
            expect(await targetInputCheckbox.isSelected()).toBe(true);
        });

        // Flag is skipped due to random groupId value
        // Dropdown test should be implemented as separate test
    });

    it('copy cell and paste into corresponding cell template', async () => {// ✅

        let source: CellLocation = {
            idx: 0,
            idy: 4,
        }

        let sourceCell: WebElement;
        let targetCell: WebElement;
        let sourceCellContent: string;

        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.copy();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.copy();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.copy();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.copy();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.copy();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        sourceCellContent = await sourceCell.getText();
        await utils.copy();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toEqual(await targetCell.getText());
        });

        source = {
            ...source,
            idx: source.idx + 1,
        };
        sourceCell = await utils.focusCell(source);
        const checkboxInput = await sourceCell.findElement(By.css('input'));
        const isChecked = await checkboxInput.isSelected();
        await utils.runAssertion(async () => {
            expect(isChecked).toBe(true);
        });
        await utils.copy();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.paste();

        const targetInputCheckbox = await targetCell.findElement(By.css('input'));
        await utils.runAssertion(async () => {
            expect(await targetInputCheckbox.isSelected()).toBe(true);
        });

        // Flag is skipped due to random groupId value
        // Dropdown test should be implemented as separate test

    });

    it.skip('copy on Dropdown cell', async () => {
        // 🟠 TODO fix
        let source: CellLocation = {
            idx: 8,
            idy: 5,
        }

        let targetCell: WebElement;
        let sourceCellContent: string;

        let sourceCell: WebElement;
        sourceCell = await utils.focusCell(source);
        const reactDropdownOption = await driver.findElement(By.id('react-select-4-option-0'));
        reactDropdownOption.click();
        sourceCellContent = await sourceCell.getText();
        await utils.runAssertion(async () => {
            expect(sourceCellContent).toBe('React');
        });

        await utils.copy();
        targetCell = await utils.focusCell({ ...source, idy: source.idy + 1 });
        await utils.sendKeys(Key.ESCAPE);
        await driver.sleep(500);
        await utils.paste();
        await driver.sleep(500);
        const targetCellContent = await (await utils.getCell({ ...source, idy: source.idy + 1 })).getText();

        await utils.runAssertion(async () => {
            expect(sourceCellContent).toBe(targetCellContent);
        });
    });

    it('should NOT paste cell into diffrent groupId (A <-> B)', async () => { // ✅

        const cellALocation: CellLocation = {
            idx: 0,
            idy: 3,
        }

        const cellBLocation = {
            idx: 1,
            idy: 3,
        }

        const cellA = await utils.getCell(cellALocation);
        const cellAText = await cellA.getText();

        const cellB = await utils.getCell(cellBLocation);
        const cellBText = await cellB.getText();

        await utils.focusCell(cellALocation);
        await utils.copy();
        await utils.focusCell(cellBLocation);
        await utils.paste();
        await driver.sleep(500);

        const cellBAfterPaste = await utils.getCell(cellBLocation);
        const cellBAfterPasteText = await cellBAfterPaste.getText();

        await utils.runAssertion(async () => {
            expect(cellAText).not.toBe(cellBAfterPasteText);
            expect(cellBText).toBe(cellBAfterPasteText);
        });

    });

    it.skip('should paste cell content into outer input', async () => {
        await utils.copy();
        const outerInput = await utils.getOuterInput();
        // await utils.takeScreenshot('fdsfds');
    });

    it('multi cell text is pasted into single cell', async () => { // ✅
        const text = `text0	text1`; // test with tabs 

        const targetLocation: CellLocation = {
            idx: 1,
            idy: 4,
        }

        await utils.focusCell(targetLocation);
        await utils.writeTextToClipboard(text);
        await utils.paste();
        const cell = await utils.getCell(targetLocation);
        const cellText = await cell.getText();

        const textWithSpaces = text.replace('	', ' ');

        await utils.runAssertion(async () => {
            if (utils.getConfig().isPro) {
                expect(cellText).toBe('text0');
            } else {
                // int desktopSafari pasted text is joined with tab char
                if (utils.getTestedBrowser() === 'desktopSafari') {
                    expect(cellText).toBe(text);
                } else {
                    expect(cellText).toBe(textWithSpaces);
                }
            }
        }, async () => {
            await utils.takeScreenshot('multi cell text is pasted into single cell');
        });

    });

    it('should paste content from other source', async () => { // ✅

        const targetLocation: CellLocation = {
            idx: 1,
            idy: 0,
        }

        const actions = driver.actions();
        await driver.get('https://handsontable.com/examples?manual-resize&manual-move&conditional-formatting&context-menu&filters&dropdown-menu&headers');
        const el = await driver.findElement(By.className(`flag jpy`));
        await actions
            .dragAndDrop(el, {
                x: 200,
                y: 100,
            })
            .perform();
        if (utils.getTestedBrowser() === 'desktopSafari') {
            await utils.cut();
        } else {
            await driver.findElement(By.className('handsontableInput')).sendKeys(Key.META + 'c');
        }
        await utils.visit();
        await utils.focusCell(targetLocation);
        await utils.paste();
        const cell = await utils.getCell(targetLocation);
        const cellText = await cell.getText();

        await utils.runAssertion(async () => {
            expect(cellText).toContain('JPY');
            if (!utils.getConfig().isPro) {
                expect(cellText).toContain('Australian Dollar');
                expect(cellText).toContain('Pound Sterling');
            }
        }, async () => {
            await utils.takeScreenshot('should paste content from other source ');
        });

    });

});
