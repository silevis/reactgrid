const Utils = require('../../common/utils');
const config = require('../../../../src/test/testEnvConfig');
const Constants = require('../../common/constants');

context('Scroll', () => {
    beforeEach(() => {
        Utils.visitSticky();
    });

    it.skip('should scroll viewport when cell is partially visible and focused', () => { // ✅
        Utils.scrollTo(0, Utils.getCellYCenter());
        Utils.selectCell(config.cellWidth + 5, config.cellHeight * config.stickyTop + 5);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());

        Utils.assertElementTopIsEqual(Utils.getCellFocus(), 0);

        Utils.scrollTo(0, Utils.getCellYCenter());

        Utils.selectCell((config.cellWidth * config.stickyLeft) + 5, config.cellHeight * config.stickyTop + 5);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());

        Utils.assertElementTopIsEqual(Utils.getCellFocus(), 0);
    });

    it('should scroll viewport when cell is not fully visible vertically', () => { // ✅
        Utils.scrollTo(0, Utils.getCellYCenter());
        Utils.selectCell(config.cellWidth + 5, config.cellHeight * config.stickyTop + 5);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());

        Utils.assertElementTopIsEqual(Utils.getCellFocus(), 0);

        Utils.scrollTo(0, Utils.getCellYCenter());

        Utils.selectCell((config.cellWidth * config.stickyLeft) + (config.cellWidth * 2), config.cellHeight * config.stickyTop + 5);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());

        Utils.assertElementTopIsEqual(Utils.getCellFocus(), 0);
    });

    it('should scroll viewport when cell is not fully visible horizontally', () => { // ✅
        Utils.scrollTo(Utils.getCellXCenter(), 0);
        Utils.selectCell(config.cellWidth * config.stickyLeft + 5, config.cellHeight + 5);
        Utils.assertIsElementInScrollable(Utils.getCellFocus());

        Utils.assertElementLeftIsEqual(Utils.getCellFocus(), 0);

        Utils.getScrollableElement().then($viewport => {
            const v = $viewport[0];
            Utils.selectCell(v.clientWidth - 5, config.cellHeight + Utils.getCellYCenter());

            Utils.assertIsElementInScrollable(Utils.getCellFocus());
            const stickySize = config.stickyLeft * config.cellWidth;
            Utils.assertElementLeftIsEqual(Utils.getCellFocus(), v.clientWidth - stickySize - (v.clientWidth) % config.cellWidth - config.lineWidth)
        });
    });

    it('should scroll to top on arrow down and focus enter scrollable area', () => { // ✅
        Utils.scrollToBottom();
        Utils.selectCell(config.cellWidth * 2 + Utils.getCellXCenter(), Utils.getCellYCenter());
        for (let i = 0; i < config.stickyTop; i++) {
            Utils.keyDown(Constants.keyCodes.ArrowDown, { force: true });
        };
        Utils.assertScrolledToTop();
    });

    it('should scroll to left on arrow right and focus enter scrollable area', () => { // ✅
        Utils.scrollToRight();
        Utils.selectCell(Utils.getCellXCenter(), config.cellHeight * 5 + Utils.getCellYCenter());
        for (let i = 0; i < config.stickyLeft; i++) {
            Utils.keyDown(Constants.keyCodes.ArrowRight, { force: true });
        };
        Utils.assertScrolledToLeft();
    });

});