/// <reference types="Cypress" />

const Utils = require('../../common/utils');
const Constants = require('../../common/constants');
const config = require('../../../../src/test/testEnvConfig');

context('Hidden focus', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('should capture text typing after cell selection', () => { // ✅
        cy.wait(300);
        Utils.selectCell(200, 100);
        cy.wait(300);
        Utils.keyDown(Constants.keyCodes.Enter, { force: true }, 200, true);
        cy.wait(300);
        cy.focused().type(Utils.randomText(), { force: true });
    });

    it.skip('focus should back to grid on Shift + TAB key', () => {//  🔶
        // 🔶 test passing when browser window in blurred
        Utils.selectCell(200, 100);
        Utils.getOuterInput().focus().wait(200);

        cy.focused()
            .type('text', { force: true })
            .trigger('keydown', { keyCode: Constants.keyCodes.Tab, shiftKey: true, force: true })
            .wait(500)
            .trigger('keyup', { shiftKey: true, force: true });
        cy.wait(300);
        cy.focused().should('have.class', 'rg-hidden-element');
    });

    it('should be able to type text outside grid', () => { // ✅
        Utils.getOuterInput().focus().wait(200);
        cy.focused().invoke('val').should('be.empty');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.focused().invoke('val').should('not.be.empty');
        Utils.selectCell(200, 100);
        cy.focused().should('have.class', 'rg-hidden-element');
    });

});