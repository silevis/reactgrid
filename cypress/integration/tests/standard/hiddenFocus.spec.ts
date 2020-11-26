/// <reference types="Cypress" />

import { visit } from '../../common/visit';
import { constants } from '../../common/constants';
import { getOuterInput } from '../../common/DOMElements';
import { Utils } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

context('Hidden focus', () => {

    beforeEach(() => {
        visit();
    });

    it('should capture text typing after cell selection', () => { // ✅
        cy.wait(500);
        Utils.selectCell(config.cellWidth + (config.cellWidth / 2), config.cellHeight * 4);
        cy.wait(500);
        Utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.wait(500);
        cy.focused().type(Utils.randomText(), { force: true });
    });

    it('focus should back to grid on Shift + TAB key', () => {//  ✅
        Utils.selectCell(config.cellWidth + (config.cellWidth / 2), config.cellHeight * 4);
        getOuterInput().focus();
        cy.wait(500);
        (cy.focused().type('text', { force: true }) as any).tab({ shift: true });
        cy.wait(500);
        cy.focused().should('have.class', 'rg-hidden-element');
    });

    it('should be able to type text outside grid', () => { // ✅
        getOuterInput().focus();
        cy.wait(500)
        cy.focused().invoke('val').should('be.empty');
        cy.focused().type(Utils.randomText(), { force: true });
        cy.wait(500);
        cy.focused().invoke('val').should('not.be.empty');
        Utils.selectCell(200, 100);
        cy.wait(500);
        cy.focused().should('have.class', 'rg-hidden-element');
    });

});