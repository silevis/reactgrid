/// <reference types="Cypress" />
const Utils = require('../../common/utils');
const config = require('../../../../src/test/testEnvConfig');

context('Other', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('should dont not copy values between cells after change focus position', () => { // ✅
        const x = Utils.getCellXCenter();
        const y = Utils.getCellYCenter() + (config.cellHeight * 2);
        Utils.getCell(1, 2).invoke('text').then(text => {
            Utils.selectCellInEditMode(x, y);
            Utils.selectCell(x + config.cellWidth, y);
            Utils.getCell(1, 2).contains(text);
        });
    });

    it('should dont open cell editor on non editable cell', () => { // ✅
        Utils.scrollTo(config.cellWidth * 8, 0);
        cy.wait(200);
        Utils.selectCellInEditMode(Utils.getCellXCenter(), config.cellHeight * 2 + Utils.getCellYCenter());
        Utils.getCellEditor().should('not.be.visible');
    });

});
