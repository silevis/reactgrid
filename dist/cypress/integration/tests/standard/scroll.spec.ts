import { visit } from '../../common/visit';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Scroll', () => {

    beforeEach(() => {
        visit();
    });

    it('should scroll viewport when cell is not fully visible vertically', () => {  // ✅
        utils.scrollTo(0, config.cellHeight * 5);
        cy.wait(utils.wait());
        utils.selectCell(config.cellWidth + 5, config.rgViewportHeight - 20);
        utils.assertIsElementInScrollable(utils.getCellFocus());
        cy.wait(utils.wait());
        utils.selectCell(config.cellWidth + 5, 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());
    });

    it('should scroll viewport when cell is not fully visible horizontally', () => { // ✅
        utils.scrollTo(config.cellWidth + utils.getCellXCenter(), 0);
        cy.wait(utils.wait());
        utils.selectCell(config.rgViewportWidth - 20, config.cellHeight * 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());
        cy.wait(utils.wait());
        utils.selectCell(5, config.cellHeight * 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());
    });

    it('should scroll to bottom on arrow down keydown', () => { // ✅
        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), 10);
        utils.scrollToRight();
        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), 10);
        for (let i = 0; i < config.rows; i++) {
            utils.keyDown(constants.keyCodes.ArrowDown, { force: true }, 20, false);
        }
        cy.wait(utils.wait());
        utils.assertIsElementInScrollable(utils.getCellFocus());
        cy.wait(utils.wait());
        utils.assertScrolledToBottom();
    });

    it('should scroll to top on arrow up keydown', () => { // ✅
        utils.scrollToBottom();
        cy.wait(200);
        utils.selectCell(config.cellWidth * 2 + 10, config.rgViewportHeight - config.cellHeight - 1);
        for (let i = 0; i < config.rows; i++) utils.keyDown(constants.keyCodes.ArrowUp, { force: true }, 20, false);
        cy.wait(utils.wait());
        utils.assertIsElementInScrollable(utils.getCellFocus());
        cy.wait(utils.wait());
        utils.assertScrolledToTop();
    });

    it('should scroll to right on arrow right keydown', () => { // ✅
        utils.selectCell(utils.getCellXCenter(), (config.cellHeight * 5) + 10);
        for (let i = 0; i < config.columns; i++) utils.keyDown(constants.keyCodes.ArrowRight, { force: true }, 20, false);
        cy.wait(utils.wait());
        utils.assertIsElementInScrollable(utils.getCellFocus());
        cy.wait(utils.wait());
        utils.assertScrolledToRight(true);
    });

    it('should scroll to left on arrow left keydown', () => { // ✅
        utils.scrollToRight();
        cy.wait(utils.wait());
        utils.selectCell(config.rgViewportWidth - 75, (config.cellHeight * 5) + 10);
        for (let i = 0; i < config.columns; i++) utils.keyDown(constants.keyCodes.ArrowLeft, { force: true }, 20, false);
        cy.wait(utils.wait());
        utils.assertIsElementInScrollable(utils.getCellFocus());
        cy.wait(utils.wait());
        utils.assertScrolledToLeft();
    });
})