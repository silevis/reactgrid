import { visitSticky } from '../../common/visit';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Scroll', () => {

    beforeEach(() => {
        visitSticky();
    });

    it('should scroll viewport when cell is partially visible and focused', () => { // ✅
        utils.scrollTo(0, utils.getCellYCenter());
        utils.selectCell(config.cellWidth + 5, config.cellHeight * config.stickyTop + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);

        utils.scrollTo(0, utils.getCellYCenter());

        utils.selectCell((config.cellWidth * config.stickyLeft) + 5, config.cellHeight * config.stickyTop + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);
    });

    it('should scroll viewport when cell is not fully visible vertically', () => { // ✅
        utils.scrollTo(0, utils.getCellYCenter());
        utils.selectCell(config.cellWidth + 5, config.cellHeight * config.stickyTop + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);

        utils.scrollTo(0, utils.getCellYCenter());

        utils.selectCell((config.cellWidth * config.stickyLeft) + (config.cellWidth * 2), config.cellHeight * config.stickyTop + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);
    });

    it('should scroll viewport when cell is not fully visible horizontally', () => { // ✅
        utils.scrollTo(utils.getCellXCenter(), 0);
        utils.selectCell(config.cellWidth * config.stickyLeft + 5, config.cellHeight + 5);
        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.assertElementLeftIsEqual(utils.getCellFocus(), 0);

        utils.getScrollableElement().then($viewport => {
            const v = $viewport[0];
            const stickyRightSize = config.stickyRight * config.cellWidth;
            utils.selectCell(v.clientWidth - stickyRightSize - 20, config.cellHeight + utils.getCellYCenter());

            utils.assertIsElementInScrollable(utils.getCellFocus());
            const stickyLeftSize = config.stickyLeft * config.cellWidth;

            cy.wait(utils.wait());
            utils.assertElementLeftIsEqual(utils.getCellFocus(), v.clientWidth - stickyLeftSize - stickyRightSize - (v.clientWidth) % config.cellWidth - config.lineWidth)
        });
    });

    it('should scroll to top on arrow down and focus enter scrollable area', () => { // ✅
        utils.scrollToBottom();
        utils.selectCell(config.cellWidth * 2 + utils.getCellXCenter(), utils.getCellYCenter());
        for (let i = 0; i < config.stickyTop; i++) {
            utils.keyDown(constants.keyCodes.ArrowDown, { force: true });
        }
        utils.assertScrolledToTop();
    });

    it('should scroll to left on arrow right and focus enter scrollable area', () => { // ✅
        utils.scrollToRight();
        utils.selectCell(utils.getCellXCenter(), config.cellHeight * 5 + utils.getCellYCenter());
        for (let i = 0; i < config.stickyLeft; i++) {
            utils.keyDown(constants.keyCodes.ArrowRight, { force: true });
        }
        utils.assertScrolledToLeft();
    });

});
