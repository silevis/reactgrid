
import { visit } from '../../common/visit';
import { getCellEditor, getCell } from '../../common/DOMElements';
import { Utils } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

context('Other', () => {

    beforeEach(() => {
        visit();
    });

    it('should dont not copy values between cells after change focus position', () => { // ✅
        const x = Utils.getCellXCenter();
        const y = Utils.getCellYCenter() + (config.cellHeight * 2);
        getCell(1, 2).invoke('text').then(text => {
            Utils.selectCellInEditMode(x, y);
            Utils.selectCell(x + config.cellWidth, y);
            getCell(1, 2).contains(text);
        });
    });

    it('should dont open cell editor on non editable cell', () => { // ✅
        Utils.scrollTo(config.cellWidth * 8, 0);
        cy.wait(Utils.wait());
        Utils.selectCellInEditMode(Utils.getCellXCenter(), config.cellHeight * 2 + Utils.getCellYCenter());
        getCellEditor().should('not.exist');
    });

});
