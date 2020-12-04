/// <reference types="Cypress" />
import { visitStickyPinnedToBody } from '../../common/visit';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { enablePinnedToBodyConfig as config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Sticky pinned to body - scroll', () => {

    beforeEach(() => {
        visitStickyPinnedToBody();
    });

    it('should scroll to bottom, enter to scrollable area with keys and scroll to top', () => { // ✅
        utils.scrollToBottom();
        utils.assertScrolledToBottom();
        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), utils.getCellYCenter(), { force: true });
        for (let i = 0; i < config.stickyTop; i++) {
            utils.keyDown(constants.keyCodes.ArrowDown, { force: true });
        };
        utils.assertScrolledToTop();
    });

    it('should scroll to right and enter to scrollable area with keys and scroll to left', () => { // ✅
        utils.scrollToRight();
        utils.selectCell(utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter(), { force: true });
        for (let i = 0; i < config.stickyLeft; i++) {
            utils.keyDown(constants.keyCodes.ArrowRight, { force: true });
        };
        utils.assertScrolledToLeft();
    });

});