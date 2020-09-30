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
        Utils.selectCell(config.cellWidth + (config.cellWidth / 2), config.cellHeight * 4);
        cy.wait(300);
        Utils.keyDown(Constants.keyCodes.Enter, { force: true }, 200, true);
        cy.wait(300);
        cy.focused().type(Utils.randomText(), { force: true });
    });

    it('focus should back to grid on Shift + TAB key', () => {//  ✅
        Utils.selectCell(config.cellWidth + (config.cellWidth / 2), config.cellHeight * 4);
        Utils.getOuterInput().focus().wait(200);
        cy.focused().type('text', { force: true }).tab({ shift: true });
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