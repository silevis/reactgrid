const Utils = require('../../common/utils');
const config = require('../../../../src/test/testEnvConfig');
const Constants = require('../../common/constants');

context('Scroll', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('should scroll viewport when cell is not fully visible vertically', () => {  // ✅
        Utils.scrollTo(0, config.cellHeight * 5);
        cy.wait(500);
        Utils.selectCell(config.cellWidth + 5, config.rgViewportHeight - 20);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());
        cy.wait(500);
        Utils.selectCell(config.cellWidth + 5, 5);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());
    });

    it('should scroll viewport when cell is not fully visible horizontally', () => { // ✅
        Utils.scrollTo(config.cellWidth + Utils.getCellXCenter(), 0);
        cy.wait(500);
        Utils.selectCell(config.rgViewportWidth - 20, config.cellHeight * 5);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());
        cy.wait(500);
        Utils.selectCell(5, config.cellHeight * 5);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());
    });

    it('should scroll to bottom on arrow down keydown', () => { // ✅
        Utils.selectCell(config.cellWidth * 2 + Utils.getCellXCenter(), 10);
        for (let i = 0; i < config.rows; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { force: true }, 20, false);
        cy.wait(500);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());
        cy.wait(500);
        Utils.assertScrolledToBottom(false);
    });

    it('should scroll to top on arrow up keydown', () => { // ✅
        Utils.scrollToBottom();
        cy.wait(200);
        Utils.selectCell(config.cellWidth * 2 + 10, config.rgViewportHeight - config.cellHeight - 1);
        for (let i = 0; i < config.rows; i++) Utils.keyDown(Constants.keyCodes.ArrowUp, { force: true }, 20, false);
        cy.wait(500);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());
        cy.wait(500);
        Utils.assertScrolledToTop();
    });

    it('should scroll to right on arrow right keydown', () => { // ✅
        Utils.selectCell(Utils.getCellXCenter(), (config.cellHeight * 5) + 10);
        for (let i = 0; i < config.columns; i++) Utils.keyDown(Constants.keyCodes.ArrowRight, { force: true }, 20, false);
        cy.wait(500);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());
        cy.wait(500);
        Utils.assertScrolledToRight(config.isPro);
    });

    it('should scroll to left on arrow left keydown', () => { // ✅
        Utils.scrollToRight();
        cy.wait(500);
        Utils.selectCell(config.rgViewportWidth - 75, (config.cellHeight * 5) + 10);
        for (let i = 0; i < config.columns; i++) Utils.keyDown(Constants.keyCodes.ArrowLeft, { force: true }, 20, false);
        cy.wait(500);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());
        cy.wait(500);
        Utils.assertScrolledToLeft();
    });
})