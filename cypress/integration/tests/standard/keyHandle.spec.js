// <reference types="Cypress" />
const Utils = require('../../common/utils');
const Constants = require('../../common/constants');
const config = require('../../../../src/test/testEnvConfig');

context('Keyboard', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('End & home should navigate to last and first cell', () => { // ✅
        Utils.selectCell(Utils.getCellXCenter() + config.cellWidth, Utils.getCellYCenter() + config.cellHeight);

        Utils.keyDown(Constants.keyCodes.Home, { force: true });

        Utils.assertElementLeftIsEqual(Utils.getCellFocus(), 0);
        Utils.assertScrolledToLeft();

        Utils.keyDown(Constants.keyCodes.End, { force: true });

        Utils.assertElementLeftIsEqual(Utils.getCellFocus(), config.cellWidth * (config.columns - 1) - config.lineWidth);
        Utils.assertScrolledToRight();

        Utils.keyDown(Constants.keyCodes.Home, { force: true });

        Utils.assertElementLeftIsEqual(Utils.getCellFocus(), 0);
        Utils.assertScrolledToLeft();
    });

    it('PageUp and PageDown should navigate to first and last visible row', () => { // ✅
        Utils.selectCell(Utils.getCellXCenter() + config.cellWidth, Utils.getCellYCenter() + config.cellHeight);
        Utils.keyDown(Constants.keyCodes.PageUp, { force: true });

        Utils.assertElementTopIsEqual(Utils.getCellFocus(), 0);

        const keyDownCount = Math.ceil(config.rows / (config.rgViewportHeight / config.cellHeight));

        for (let i = 0; i < keyDownCount; i++) {
            Utils.keyDown(Constants.keyCodes.PageDown, { force: true, log: false }, 500, false);
            Utils.assertIsElementInScrollable(Utils.getCellFocus());
        };

        Utils.assertElementTopIsEqual(Utils.getCellFocus(), config.cellHeight * (config.rows - 1) - config.lineWidth);

        for (let i = 0; i < keyDownCount; i++) {
            Utils.keyDown(Constants.keyCodes.PageUp, { force: true, log: false }, 500, false);
            Utils.assertIsElementInScrollable(Utils.getCellFocus());
        };

        Utils.assertElementTopIsEqual(Utils.getCellFocus(), 0);
    });

    it('Arrows should navigate up/down/left/right', () => {  // ✅
        const keyDownCount = 4;
        const initFocusTop = config.cellHeight * 5;
        const initFocusLeft = config.cellWidth * 3;

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            Utils.getCellFocus().then($focus => {
                expect(Math.round(($focus.position().top))).to.be.equal(initFocusTop - 1 - (i * config.cellHeight));
            });
            cy.wait(200);
            Utils.keyDown(Constants.keyCodes.ArrowUp, { force: true });
        };

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            Utils.getCellFocus().then($focus => {
                expect(Math.round(($focus.position().top))).to.be.equal(initFocusTop - 1 + (i * config.cellHeight));
            });
            cy.wait(200);
            Utils.keyDown(Constants.keyCodes.ArrowDown, { force: true });
        };

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            Utils.getCellFocus().then($focus => {
                expect(Math.round(($focus.position().left))).to.be.equal(initFocusLeft - 1 + (i * config.cellWidth));
            });
            cy.wait(200);
            Utils.keyDown(Constants.keyCodes.ArrowRight, { force: true });
        };

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount - 1; i++) {
            Utils.getCellFocus().then($focus => {
                expect(Math.round(($focus.position().left))).to.be.equal(initFocusLeft - 1 - (i * config.cellWidth));
            });
            cy.wait(200);
            Utils.keyDown(Constants.keyCodes.ArrowLeft, { force: true });
        };
    });

    it('TAB navigate to next cell, Shift + TAB navigate to previous cell', () => { // ✅
        const keyDownCount = 3;
        const initFocusTop = config.cellHeight * 6;
        const initFocusLeft = config.cellWidth * 3;

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            Utils.getCellFocus().then($focus => {
                expect(Math.round(($focus.position().left))).to.be.equal(initFocusLeft - 1 + (i * config.cellWidth));
            });
            cy.wait(200);
            Utils.keyDown(Constants.keyCodes.Tab, { force: true });
        };

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            Utils.getCellFocus().then($focus => {
                expect(Math.round(($focus.position().left))).to.be.equal(initFocusLeft - 1 - (i * config.cellWidth));
            });
            cy.wait(200);
            Utils.keyDown(Constants.keyCodes.Tab, { shiftKey: true, force: true });
        };
    });

    it('Enter key pressed should activate cell edit mode', () => { // 🔶
        // 🔶 test passes if browser is focused

        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        cy.wait(1000);
        Utils.getCellEditor().should('be.visible').and('have.length', 1);
    });

    it.skip('Escape key pressed should exit from edit mode without changes', () => {  // 🔴
        // TODO FIX THIS FEATURE

        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        cy.wait(500);
        Utils.getCellEditor().should('be.visible').and('have.length', 1);

        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });

        cy.wait(5000);
        Utils.getCellEditor().should('be.visible').and('have.length', 1);

        Utils.keyDown(Constants.keyCodes.Esc, { force: true });
        cy.wait(500);

        Utils.getReactGrid().should('not.contain.text', randomText);
    });

    it('Delete key pressed should delete data from the cell', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());

        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });
        cy.wait(500);
        Utils.keyDown(Constants.keyCodes.Enter, { force: true });

        cy.wait(500);
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        Utils.keyDown(Constants.keyCodes.Delete, { force: true });

        cy.wait(500);
        Utils.getReactGrid().should('not.contain.text', randomText);
    });

    it('Backspace key pressed should delete data from the cell', () => { // ✅
        Utils.selectCell(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        Utils.keyDown(Constants.keyCodes.Backspace, { force: true });
        cy.wait(500);
        cy.focused().type('{leftarrow}', { force: true });
        cy.wait(500);
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        cy.wait(500);
        Utils.getCellEditor().should('have.text', '');
    });

    it('Tab key pressed should exit from cell edit mode and move to next column ', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());

        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });
        Utils.keyDown(Constants.keyCodes.Tab, { force: true });

        cy.wait(500);
        Utils.getCellEditor().should('not.be.visible');
        Utils.assertElementLeftIsEqual(Utils.getCellFocus(), config.cellWidth * 2 - config.lineWidth);
        cy.wait(500);
        Utils.getReactGrid().should('contain.text', randomText);
    });

    it('Shift + Tab key pressed should exit from cell edit mode and move to previous column ', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });
        Utils.keyDown(Constants.keyCodes.Tab, { shiftKey: true, force: true });
        cy.wait(500);

        Utils.getCellEditor().should('not.be.visible');
        cy.wait(500);
        Utils.assertElementLeftIsEqual(Utils.getCellFocus(), 0);
        cy.wait(500);
        Utils.getReactGrid().should('contain.text', randomText);
    });

    it('Enter key pressed should exit from cell edit mode and move to next row', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });

        Utils.keyDown(Constants.keyCodes.Enter, { force: true });
        cy.wait(500);
        Utils.getCellEditor().should('not.be.visible');
        cy.wait(500);
        Utils.assertElementTopIsEqual(Utils.getCellFocus(), config.cellHeight * 5 - config.lineWidth);
        cy.wait(500);
        Utils.getReactGrid().should('contain.text', randomText);
    });

    it('Shift + Enter key pressed should exit from cell edit mode and move to previous row', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });

        Utils.keyDown(Constants.keyCodes.Enter, { shiftKey: true, force: true });
        cy.wait(500);
        Utils.getCellEditor().should('not.be.visible');
        cy.wait(500);
        Utils.assertElementTopIsEqual(Utils.getCellFocus(), config.cellHeight * 3 - config.lineWidth);
        cy.wait(500);
        Utils.getReactGrid().should('contain.text', randomText);
    });

});
