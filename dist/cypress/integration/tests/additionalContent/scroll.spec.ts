import { visitAdditionalContent, visitAdditionalContentWithFlexRow } from '../../common/visit';
import { Utilities } from '../../common/utils';
import {
    enableAdditionalContentConfig, enableAdditionalContentWithFlexRowConfig
} from '../../../../src/test/testEnvConfig';
import { constants } from '../../common/constants';

const utils = new Utilities(enableAdditionalContentConfig);
const utilsFlexRow = new Utilities(enableAdditionalContentWithFlexRowConfig);

context('Scroll', () => {

    /**
     * The test should run on 100 of viewport inside cypress runner
     */
    it('should scroll viewport when cell is not fully visible vertically', () => { // ✅
        visitAdditionalContent();

        utils.scrollTo(0, 20);
        utils.selectCell(utils.getCellXCenter(), utils.getConfig().rgViewportHeight - 20);
        cy.wait(200);

        utils.assertIsElementInScrollable(utils.getCellFocus());

        utils.scrollTo(0, utils.getConfig().cellHeight * utils.getConfig().rows + utils.getConfig().rgViewportHeight - 15);
        utils.selectCell(utils.getCellXCenter(), 5);
        cy.wait(200);

        utils.assertIsElementInScrollable(utils.getCellFocus());
    });

    it('should scroll viewport when cell is not fully visible horizontally', () => { // ✅
        visitAdditionalContentWithFlexRow();

        utilsFlexRow.scrollTo(utilsFlexRow.getCellXCenter(), 0);
        utilsFlexRow.selectCell(utilsFlexRow.getConfig().rgViewportWidth - 20, utilsFlexRow.getCellYCenter());
        cy.wait(200);

        utilsFlexRow.assertIsElementInScrollable(utilsFlexRow.getCellFocus());

        utilsFlexRow.scrollTo(utilsFlexRow.getConfig().cellWidth * utilsFlexRow.getConfig().columns + utilsFlexRow.getConfig().rgViewportWidth - 15, 0);
        utilsFlexRow.selectCell(5, utilsFlexRow.getCellYCenter());
        cy.wait(200);

        utilsFlexRow.assertIsElementInScrollable(utils.getCellFocus());
    });

    it('should scroll to bottom on arrow down keydown', () => { // ✅
        visitAdditionalContent();

        utils.selectCell(utils.getConfig().cellWidth * 2 + utils.getCellXCenter(), 10);

        for (let i = 0; i < utils.getConfig().rows; i++) {
            utils.keyDown(constants.keyCodes.ArrowDown, { force: true }, 20, false);
        }
        cy.wait(utils.wait());

        utils.assertIsElementInScrollable(utils.getCellFocus());
        utils.assertScrolledToBottom();
    });

    it('should scroll to top on arrow up keydown', () => { // ✅
        visitAdditionalContent();

        utils.scrollTo(0, utils.getConfig().cellHeight * utils.getConfig().rows + utils.getConfig().rgViewportHeight - 15);
        utils.selectCell(utils.getCellXCenter(), 5);
        cy.wait(200);
        utils.selectCell(utils.getConfig().cellWidth * 2 + 10, utils.getConfig().rgViewportHeight - utils.getConfig().cellHeight - 1);
        for (let i = 0; i < utils.getConfig().rows; i++) {
            utils.keyDown(constants.keyCodes.ArrowUp, { force: true }, 20, false);
        }

        cy.wait(utils.wait());
        utils.assertIsElementInScrollable(utils.getCellFocus());
        cy.wait(utils.wait());

        utils.assertScrolledToTop();
    });

    it('should scroll to right on arrow right keydown', () => { // ✅
        visitAdditionalContentWithFlexRow();

        for (let i = 0; i < utilsFlexRow.getConfig().columns; i++) {
            utilsFlexRow.keyDown(constants.keyCodes.ArrowRight, { force: true }, 20, false);
        }
        cy.wait(utilsFlexRow.wait());
        utilsFlexRow.assertIsElementInScrollable(utilsFlexRow.getCellFocus());
        cy.wait(utilsFlexRow.wait());

        utilsFlexRow.assertScrolledToRight(true);
    });

    it('should scroll to left on arrow left keydown', () => { // ✅
        visitAdditionalContentWithFlexRow();

        utilsFlexRow.scrollTo(utilsFlexRow.getConfig().cellWidth * utilsFlexRow.getConfig().columns + utilsFlexRow.getConfig().rgViewportWidth - 15, 0);
        utilsFlexRow.selectCell(5, utilsFlexRow.getCellYCenter());

        for (let i = 0; i < utilsFlexRow.getConfig().columns; i++) {
            utilsFlexRow.keyDown(constants.keyCodes.ArrowLeft, { force: true }, 20, false);
        }
        cy.wait(utilsFlexRow.wait());
        utilsFlexRow.assertIsElementInScrollable(utils.getCellFocus());
        cy.wait(utilsFlexRow.wait());

        utilsFlexRow.assertScrolledToLeft();
    });

});
