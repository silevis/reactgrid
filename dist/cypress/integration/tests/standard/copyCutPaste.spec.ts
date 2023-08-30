import { visit } from '../../common/visit';
import { config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';

const utils = new Utilities(config);

context('Copy / Cut / Paste', () => {

    beforeEach(() => {
        visit();
    });

    it.skip('should copy values between the same cell types', () => { // 🔴

        // utils.selectCell(config.cellWidth + utils.getCellXCenter(), 200);
        // cy.focused().trigger('cut', {
        //     force: true,
        //     log: true,
        //     clipboardData: 'sdfds',
        //     bubbles: true,
        // });

        // cy.wait(5000);


        // cy.focused().trigger('paste', {
        //     force: true,
        //     log: true,
        // });
    });

    it.skip('should not update selection after paste is not handled', () => { // 🔴

    });

});
