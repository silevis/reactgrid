import { visit } from '../../common/visit';
import { constants } from '../../common/constants';
import { getCellFocus } from '../../common/DOMElements';
import {
    assertIsElementInScrollable, assertScrolledToBottom, assertScrolledToTop, assertScrolledToRight,
    assertScrolledToLeft
} from '../../common/assert';
import { Utils } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

context('Scroll', () => {

    beforeEach(() => {
        visit();
    });

    it('should scroll viewport when cell is not fully visible vertically', () => {  // ✅
        Utils.scrollTo(0, config.cellHeight * 5);
        cy.wait(Utils.wait());
        Utils.selectCell(config.cellWidth + 5, config.rgViewportHeight - 20);
        assertIsElementInScrollable(getCellFocus());
        cy.wait(Utils.wait());
        Utils.selectCell(config.cellWidth + 5, 5);
        assertIsElementInScrollable(getCellFocus());
    });

    it('should scroll viewport when cell is not fully visible horizontally', () => { // ✅
        Utils.scrollTo(config.cellWidth + Utils.getCellXCenter(), 0);
        cy.wait(Utils.wait());
        Utils.selectCell(config.rgViewportWidth - 20, config.cellHeight * 5);
        assertIsElementInScrollable(getCellFocus());
        cy.wait(Utils.wait());
        Utils.selectCell(5, config.cellHeight * 5);
        assertIsElementInScrollable(getCellFocus());
    });

    it('should scroll to bottom on arrow down keydown', () => { // ✅
        Utils.selectCell(config.cellWidth * 2 + Utils.getCellXCenter(), 10);
        Utils.scrollToRight();
        Utils.selectCell(config.cellWidth * 2 + Utils.getCellXCenter(), 10);
        for (let i = 0; i < config.rows; i++) {
            Utils.keyDown(constants.keyCodes.ArrowDown, { force: true }, 20, false);
        }
        cy.wait(Utils.wait());
        assertIsElementInScrollable(getCellFocus());
        cy.wait(Utils.wait());
        assertScrolledToBottom();
    });

    it('should scroll to top on arrow up keydown', () => { // ✅
        Utils.scrollToBottom();
        cy.wait(200);
        Utils.selectCell(config.cellWidth * 2 + 10, config.rgViewportHeight - config.cellHeight - 1);
        for (let i = 0; i < config.rows; i++) Utils.keyDown(constants.keyCodes.ArrowUp, { force: true }, 20, false);
        cy.wait(Utils.wait());
        assertIsElementInScrollable(getCellFocus());
        cy.wait(Utils.wait());
        assertScrolledToTop();
    });

    it('should scroll to right on arrow right keydown', () => { // ✅
        Utils.selectCell(Utils.getCellXCenter(), (config.cellHeight * 5) + 10);
        for (let i = 0; i < config.columns; i++) Utils.keyDown(constants.keyCodes.ArrowRight, { force: true }, 20, false);
        cy.wait(Utils.wait());
        assertIsElementInScrollable(getCellFocus());
        cy.wait(Utils.wait());
        assertScrolledToRight(config.isPro);
    });

    it('should scroll to left on arrow left keydown', () => { // ✅
        Utils.scrollToRight();
        cy.wait(Utils.wait());
        Utils.selectCell(config.rgViewportWidth - 75, (config.cellHeight * 5) + 10);
        for (let i = 0; i < config.columns; i++) Utils.keyDown(constants.keyCodes.ArrowLeft, { force: true }, 20, false);
        cy.wait(Utils.wait());
        assertIsElementInScrollable(getCellFocus());
        cy.wait(Utils.wait());
        assertScrolledToLeft();
    });
})