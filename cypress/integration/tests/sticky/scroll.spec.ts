/// <reference types="Cypress" />

import { visitSticky } from '../../common/visit';
import { constants } from '../../common/constants';
import { Utils } from '../../common/utils';
import { getCellFocus, getScrollableElement } from '../../common/DOMElements';
import {
    assertIsElementInScrollable, assertElementTopIsEqual, assertElementLeftIsEqual, assertScrolledToTop, assertScrolledToLeft
} from '../../common/assert';
import { config } from '../../../../src/test/testEnvConfig';

context('Scroll', () => {

    beforeEach(() => {
        visitSticky();
    });

    it.skip('should scroll viewport when cell is partially visible and focused', () => { // ✅
        Utils.scrollTo(0, Utils.getCellYCenter());
        Utils.selectCell(config.cellWidth + 5, config.cellHeight * config.stickyTop + 5);
        assertIsElementInScrollable(getCellFocus());

        assertElementTopIsEqual(getCellFocus(), 0);

        Utils.scrollTo(0, Utils.getCellYCenter());

        Utils.selectCell((config.cellWidth * config.stickyLeft) + 5, config.cellHeight * config.stickyTop + 5);
        assertIsElementInScrollable(getCellFocus());

        assertElementTopIsEqual(getCellFocus(), 0);
    });

    it('should scroll viewport when cell is not fully visible vertically', () => { // ✅
        Utils.scrollTo(0, Utils.getCellYCenter());
        Utils.selectCell(config.cellWidth + 5, config.cellHeight * config.stickyTop + 5);
        assertIsElementInScrollable(getCellFocus());

        assertElementTopIsEqual(getCellFocus(), 0);

        Utils.scrollTo(0, Utils.getCellYCenter());

        Utils.selectCell((config.cellWidth * config.stickyLeft) + (config.cellWidth * 2), config.cellHeight * config.stickyTop + 5);
        assertIsElementInScrollable(getCellFocus());

        assertElementTopIsEqual(getCellFocus(), 0);
    });

    it('should scroll viewport when cell is not fully visible horizontally', () => { // ✅
        Utils.scrollTo(Utils.getCellXCenter(), 0);
        Utils.selectCell(config.cellWidth * config.stickyLeft + 5, config.cellHeight + 5);
        assertIsElementInScrollable(getCellFocus());

        assertElementLeftIsEqual(getCellFocus(), 0);

        getScrollableElement().then($viewport => {
            const v = $viewport[0];
            const stickyRightSize = config.isPro ? config.stickyRight * config.cellWidth : 0;
            Utils.selectCell(v.clientWidth - stickyRightSize - 5, config.cellHeight + Utils.getCellYCenter());

            assertIsElementInScrollable(getCellFocus());
            const stickyLeftSize = config.stickyLeft * config.cellWidth;
            assertElementLeftIsEqual(getCellFocus(), v.clientWidth - stickyLeftSize - stickyRightSize - (v.clientWidth) % config.cellWidth - config.lineWidth)
        });
    });

    it('should scroll to top on arrow down and focus enter scrollable area', () => { // ✅
        Utils.scrollToBottom();
        Utils.selectCell(config.cellWidth * 2 + Utils.getCellXCenter(), Utils.getCellYCenter());
        for (let i = 0; i < config.stickyTop; i++) {
            Utils.keyDown(constants.keyCodes.ArrowDown, { force: true });
        };
        assertScrolledToTop();
    });

    it('should scroll to left on arrow right and focus enter scrollable area', () => { // ✅
        Utils.scrollToRight();
        Utils.selectCell(Utils.getCellXCenter(), config.cellHeight * 5 + Utils.getCellYCenter());
        for (let i = 0; i < config.stickyLeft; i++) {
            Utils.keyDown(constants.keyCodes.ArrowRight, { force: true });
        };
        assertScrolledToLeft();
    });

});