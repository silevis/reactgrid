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
        utils.assertScrolledToRight();
        utils.selectCell(utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter(), { force: true });
        for (let i = 0; i < config.stickyLeft - 1; i++) {
            utils.keyDown(constants.keyCodes.ArrowRight, { force: true });
        };
        utils.assertScrolledToLeft();
    });

    it('should scroll viewport when cell is is not fully visible vertically', () => { // ✅
        utils.scrollTo(0, config.cellHeight + 10);
        utils.selectCell(config.cellWidth + 5, config.cellHeight * (config.stickyTop + 1) + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);

        utils.scrollTo(0, config.cellHeight + 10);

        utils.selectCell((config.cellWidth * config.stickyLeft) + 5, config.cellHeight * (config.stickyTop + 1) + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);
    });

    it('should scroll viewport when cell is not fully visible horizontally', () => { // ✅
        utils.scrollTo(config.cellWidth + 10, 0);
        utils.selectCell(config.cellWidth * (config.stickyLeft + 1) + 5, config.cellHeight * (config.stickyTop + 1) + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);

        utils.scrollTo(config.cellWidth + 10, 0);

        utils.selectCell(config.cellWidth * (config.stickyLeft + 2) + 5, config.cellHeight * (config.stickyTop + 1) + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);
    });

});
