import { config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visitFrozenFocus } from '../../common/visit';

const utils = new Utilities(config);

context('Frozen focus', () => {

    beforeEach(() => {
        visitFrozenFocus();
    });

    it('should stay in place', () => { // ✅
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 10) - 10);
        utils.assertElementTopIsEqual(utils.getCellFocus(), config.cellHeight * 3 - 1);
    });

});
