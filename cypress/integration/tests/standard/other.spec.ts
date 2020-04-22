/// <reference types="Cypress" />
const Utils = require('../../common/utils');
const Constants = require('../../common/constants');
const config = require('../../../../src/testEnvConfig');

context('Other', () => {
    beforeEach(() => {
        Utils.visit();
    });

    it('should dont copy values between cells after change focus position', () => { // ✅

        const x = Utils.getCellXCenter() + config.cellWidth;
        const y = Utils.getCellYCenter() + (config.cellHeight * 2);

        Utils.getCell(2, 2).invoke('text').then(text => {

            Utils.selectCellInEditMode(x, y);

            Utils.selectCell(x + config.cellWidth, y);

            Utils.getCell(2, 2).contains(text);

        });

    });

});
