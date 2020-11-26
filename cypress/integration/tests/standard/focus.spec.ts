/// <reference types="Cypress" />

import { visit } from '../../common/visit';
import { constants } from '../../common/constants';
import { getCellFocus } from '../../common/DOMElements';
import { Utils } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';
import { assertElementLeftIsEqual, assertElementTopIsEqual } from '../../common/assert';

context('Focus', () => {

    beforeEach(() => {
        visit();
    });

    it('Select one cell in click without selection key meta or ctrl', () => { // ✅
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 2) - 10);
        getCellFocus().should('be.visible');
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 4) - 10);
        getCellFocus().should('be.visible');
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 6) - 10);
        getCellFocus().should('be.visible');
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 8) - 10);
        getCellFocus().should('be.visible');
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 10) - 10);
        getCellFocus().should('be.visible');
    });

    it('CTRL or META + end should select cell in first row and column ', () => { // ✅
        Utils.selectCell(config.rgViewportWidth - config.cellWidth - Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        Utils.keyDown(constants.keyCodes.Home, { metaKey: true, ctrlKey: !Utils.isMacOs() && true, force: true });

        cy.wait(Utils.wait());
        assertElementLeftIsEqual(getCellFocus(), 0);
        cy.wait(Utils.wait());
        assertElementTopIsEqual(getCellFocus(), 0);
    })

    it('CTRL or META + home should select cell in last row and column', () => { // ✅
        Utils.selectCell(config.rgViewportWidth - config.cellWidth - Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        Utils.keyDown(constants.keyCodes.End, { metaKey: true, ctrlKey: !Utils.isMacOs() && true, force: true });

        cy.wait(Utils.wait());
        assertElementLeftIsEqual(getCellFocus(), config.cellWidth * (config.columns - 1) - config.lineWidth);
        cy.wait(Utils.wait());
        assertElementTopIsEqual(getCellFocus(), config.cellHeight * (config.rows - 1) - config.lineWidth);
    })

});