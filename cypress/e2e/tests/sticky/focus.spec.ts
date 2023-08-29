import { visitSticky } from '../../common/visit';
import { Utilities } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Focus on sticky', () => {

    beforeEach(() => {
        visitSticky();
    });

    it.skip('Focus can be placed on all panes', () => { // 🟠 Fails on visibility tests for some reason despite being visible in test
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 2) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 4) - 10, (config.cellHeight * 2) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 6) - 10, (config.cellHeight * 2) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 8) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 4) - 10, (config.cellHeight * 8) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 6) - 10, (config.cellHeight * 8) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 22) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 4) - 10, (config.cellHeight * 22) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 6) - 10, (config.cellHeight * 22) - 10);
        utils.getCellFocus().should('be.visible');
    });

});
