
import { visit } from '../../common/visit';
import { constants } from '../../common/constants';
import { getCellFocus, getCellEditor, getReactGrid } from '../../common/DOMElements';
import {
    assertElementLeftIsEqual, assertScrolledToLeft, assertScrolledToRight, assertElementTopIsEqual, assertIsElementInScrollable,
} from '../../common/assert';
import { Utils } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

context('Keyboard', () => {
    beforeEach(() => {
        visit();
    });

    it('End & home should navigate to last and first cell', () => { // ✅
        Utils.selectCell(Utils.getCellXCenter() + config.cellWidth, Utils.getCellYCenter() + config.cellHeight);

        Utils.keyDown(constants.keyCodes.Home, { force: true });

        assertElementLeftIsEqual(getCellFocus(), 0);
        assertScrolledToLeft();

        Utils.keyDown(constants.keyCodes.End, { force: true });

        assertElementLeftIsEqual(getCellFocus(), config.cellWidth * (config.columns - 1) - config.lineWidth);
        assertScrolledToRight();

        Utils.keyDown(constants.keyCodes.Home, { force: true });

        assertElementLeftIsEqual(getCellFocus(), 0);
        assertScrolledToLeft();
    });

    it('PageUp and PageDown should navigate to first and last visible row', () => { // ✅
        Utils.selectCell(Utils.getCellXCenter() + config.cellWidth, Utils.getCellYCenter() + config.cellHeight);
        Utils.keyDown(constants.keyCodes.PageUp, { force: true });

        assertElementTopIsEqual(getCellFocus(), 0);

        const keyDownCount = Math.ceil(config.rows / (config.rgViewportHeight / config.cellHeight));

        for (let i = 0; i < keyDownCount; i++) {
            Utils.keyDown(constants.keyCodes.PageDown, { force: true, log: false }, 500, false);
            assertIsElementInScrollable(getCellFocus());
        };

        assertElementTopIsEqual(getCellFocus(), config.cellHeight * (config.rows - 1) - config.lineWidth);

        for (let i = 0; i < keyDownCount; i++) {
            Utils.keyDown(constants.keyCodes.PageUp, { force: true, log: false }, 500, false);
            assertIsElementInScrollable(getCellFocus());
        };

        assertElementTopIsEqual(getCellFocus(), 0);
    });

    it('Arrows should navigate up/down/left/right', () => {  // ✅
        const keyDownCount = 4;
        const initFocusTop = config.cellHeight * 5;
        const initFocusLeft = config.cellWidth * 3;

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            getCellFocus().then($focus => {
                expect(Utils.round($focus.position().top)).to.be.equal(initFocusTop - 1 - (i * config.cellHeight));
            });
            cy.wait(200);
            Utils.keyDown(constants.keyCodes.ArrowUp, { force: true });
        };

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            getCellFocus().then($focus => {
                expect(Utils.round($focus.position().top)).to.be.equal(initFocusTop - 1 + (i * config.cellHeight));
            });
            cy.wait(200);
            Utils.keyDown(constants.keyCodes.ArrowDown, { force: true });
        };

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            getCellFocus().then($focus => {
                expect(Utils.round($focus.position().left)).to.be.equal(initFocusLeft - 1 + (i * config.cellWidth));
            });
            cy.wait(200);
            Utils.keyDown(constants.keyCodes.ArrowRight, { force: true });
        };

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount - 1; i++) {
            getCellFocus().then($focus => {
                expect(Utils.round($focus.position().left)).to.be.equal(initFocusLeft - 1 - (i * config.cellWidth));
            });
            cy.wait(200);
            Utils.keyDown(constants.keyCodes.ArrowLeft, { force: true });
        };
    });

    it('TAB navigate to next cell, Shift + TAB navigate to previous cell', () => { // ✅
        const keyDownCount = 3;
        const initFocusTop = config.cellHeight * 6;
        const initFocusLeft = config.cellWidth * 3;

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            getCellFocus().then($focus => {
                expect(Utils.round($focus.position().left)).to.be.equal(initFocusLeft - 1 + (i * config.cellWidth));
            });
            cy.wait(200);
            Utils.keyDown(constants.keyCodes.Tab, { force: true });
        };

        Utils.selectCell(initFocusLeft + Utils.getCellXCenter(), initFocusTop + Utils.getCellYCenter());
        for (let i = 0; i < keyDownCount; i++) {
            getCellFocus().then($focus => {
                expect(Utils.round($focus.position().left)).to.be.equal(initFocusLeft - 1 - (i * config.cellWidth));
            });
            cy.wait(200);
            Utils.keyDown(constants.keyCodes.Tab, { shiftKey: true, force: true });
        };
    });

    it('Enter key pressed should activate cell edit mode', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        cy.wait(Utils.wait());
        getCellEditor().should('be.visible').and('have.length', 1);
    });

    it.skip('Escape key pressed should exit from edit mode without changes', () => {  // 🔴
        // TODO FIX THIS FEATURE

        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        cy.wait(Utils.wait());
        getCellEditor().should('be.visible').and('have.length', 1);

        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });

        cy.wait(5000);
        getCellEditor().should('be.visible').and('have.length', 1);

        Utils.keyDown(constants.keyCodes.Esc, { force: true });
        cy.wait(Utils.wait());

        getReactGrid().should('not.contain.text', randomText);
    });

    it('Delete key pressed should delete data from the cell', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());

        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });
        cy.wait(Utils.wait());
        Utils.keyDown(constants.keyCodes.Enter, { force: true });

        cy.wait(Utils.wait());
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        Utils.keyDown(constants.keyCodes.Delete, { force: true });

        cy.wait(Utils.wait());
        getReactGrid().should('not.contain.text', randomText);
    });

    it('Backspace key pressed should delete data from the cell', () => { // ✅
        Utils.selectCell(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        Utils.keyDown(constants.keyCodes.Backspace, { force: true });
        cy.wait(Utils.wait());
        cy.focused().type('{leftarrow}', { force: true });
        cy.wait(Utils.wait());
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        cy.wait(Utils.wait());
        getCellEditor().should('have.text', '');
    });

    it('Tab key pressed should exit from cell edit mode and move to next column ', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());

        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });
        Utils.keyDown(constants.keyCodes.Tab, { force: true });

        cy.wait(Utils.wait());
        getCellEditor().should('not.exist');
        assertElementLeftIsEqual(getCellFocus(), config.cellWidth * 2 - config.lineWidth);
        cy.wait(Utils.wait());
        getReactGrid().should('contain.text', randomText);
    });

    it('Shift + Tab key pressed should exit from cell edit mode and move to previous column ', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });
        Utils.keyDown(constants.keyCodes.Tab, { shiftKey: true, force: true });
        cy.wait(Utils.wait());

        getCellEditor().should('not.exist');
        cy.wait(Utils.wait());
        assertElementLeftIsEqual(getCellFocus(), 0);
        cy.wait(Utils.wait());
        getReactGrid().should('contain.text', randomText);
    });

    it('Enter key pressed should exit from cell edit mode and move to next row', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });

        Utils.keyDown(constants.keyCodes.Enter, { force: true });
        cy.wait(Utils.wait());
        getCellEditor().should('not.exist');
        cy.wait(Utils.wait());
        assertElementTopIsEqual(getCellFocus(), config.cellHeight * 5 - config.lineWidth);
        cy.wait(Utils.wait());
        getReactGrid().should('contain.text', randomText);
    });

    it('Shift + Enter key pressed should exit from cell edit mode and move to previous row', () => { // ✅
        Utils.selectCellInEditMode(config.cellWidth + Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        const randomText = Utils.randomText();
        cy.focused().type(randomText, { force: true });

        Utils.keyDown(constants.keyCodes.Enter, { shiftKey: true, force: true });
        cy.wait(Utils.wait());
        getCellEditor().should('not.exist');
        cy.wait(Utils.wait());
        assertElementTopIsEqual(getCellFocus(), config.cellHeight * 3 - config.lineWidth);
        cy.wait(Utils.wait());
        getReactGrid().should('contain.text', randomText);
    });

});
