import { visit } from '../../common/visit';
import { Utilities } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Other', () => {

    beforeEach(() => {
        visit();
    });

    it('shouldn\'t "copy" values between cells after change focus position', () => { // ✅
        const x = utils.getCellXCenter();
        const y = utils.getCellYCenter() + (config.cellHeight * 2);
        utils.getCell(1, 2).invoke('text').then(text => {
            utils.selectCellInEditMode(x, y);
            utils.selectCell(x + config.cellWidth, y);
            utils.getCell(1, 2).contains(text);
        });
    });

    it('shouldn\'t open cell editor on non editable cell', () => { // ✅
        utils.scrollTo(config.cellWidth * 8, 0);
        cy.wait(utils.wait());
        utils.selectCellInEditMode(utils.getCellXCenter(), config.cellHeight * 2 + utils.getCellYCenter());
        utils.getCellEditor().should('not.exist');
    });

});
