import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { disabledInitialFocusLocationConfig as config } from '../../../../src/test/testEnvConfig';
import { visitHeaders } from '../../common/visit';

const utils = new Utilities(config);

context('Focus', () => {

    beforeEach(() => {
        visitHeaders();
    });

    it.skip('should reach first top focusable cell on page up key', () => { // ✅
        // 🟠  fix while skipping non focusable cell

        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.PageDown, { force: true });
        utils.keyDown(constants.keyCodes.PageDown, { force: true });
        utils.keyDown(constants.keyCodes.PageUp, { force: true });
        utils.keyDown(constants.keyCodes.PageUp, { force: true });

        utils.assertElementTopIsEqual(utils.getCellFocus(), config.cellHeight - config.lineWidth);

    });

    it.skip('should reach first left focusable cell on home key', () => { // ✅
        // 🟠  fix while skipping non focusable cell

        utils.selectCell(config.cellWidth * 3 + utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.End, { force: true });
        utils.keyDown(constants.keyCodes.Home, { force: true });

        utils.assertElementLeftIsEqual(utils.getCellFocus(), config.cellWidth - config.lineWidth);

    });

});
