/// <reference types="Cypress" />

const Utils = require('../../common/utils');
const Constants = require('../../common/constants');
const config = require('../../../../src/test/testEnvConfig');

context('Focus', () => {

    beforeEach(() => {
        Utils.visit();
    });

    it('Select one cell in click without selection key meta or ctrl', () => { // ✅
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 2) - 10);
        Utils.getCellFocus().should('be.visible');
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 4) - 10);
        Utils.getCellFocus().should('be.visible');
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 6) - 10);
        Utils.getCellFocus().should('be.visible');
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 8) - 10);
        Utils.getCellFocus().should('be.visible');
        Utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 10) - 10);
        Utils.getCellFocus().should('be.visible');
    });

    it('CTRL or META + end should select cell in first row and column ', () => { // ✅
        Utils.selectCell(config.rgViewportWidth - config.cellWidth - Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        Utils.keyDown(Constants.keyCodes.Home, { metaKey: true, ctrlKey: !Utils.isMacOs() && true, force: true });

        cy.wait(500);
        Utils.assertElementLeftIsEqual(Utils.getCellFocus(), 0);
        cy.wait(500);
        Utils.assertElementTopIsEqual(Utils.getCellFocus(), 0);
    })

    it('CTRL or META + home should select cell in last row and column', () => { // ✅
        Utils.selectCell(config.rgViewportWidth - config.cellWidth - Utils.getCellXCenter(), config.cellHeight * 4 + Utils.getCellYCenter());
        Utils.keyDown(Constants.keyCodes.End, { metaKey: true, ctrlKey: !Utils.isMacOs() && true, force: true });

        cy.wait(500);
        Utils.assertElementLeftIsEqual(Utils.getCellFocus(), config.cellWidth * (config.columns - 1) - config.lineWidth);
        cy.wait(500);
        Utils.assertElementTopIsEqual(Utils.getCellFocus(), config.cellHeight * (config.rows - 1) - config.lineWidth);
    })

});