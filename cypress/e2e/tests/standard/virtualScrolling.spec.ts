import { disableVirtualScrolling as config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visitDisabledVirtualScrolling } from '../../common/visit';

const utils = new Utilities(config);

context('Check disabling virtual scrolling', () => {

    beforeEach(() => {
        visitDisabledVirtualScrolling();
    });

    it('every cell should render', () => { // ✅
        expect(utils.getAllCells().should('have.length', config.columns * config.rows));
    });

});
