import { visitAdditionalContent, visitAdditionalContentWithFlexRow } from '../../common/visit';
import { Utilities } from '../../common/utils';
import {
    enableAdditionalContentConfig, enableAdditionalContentWithFlexRowConfig
} from '../../../../src/test/testEnvConfig';

const utils = new Utilities(enableAdditionalContentConfig);
const utilsFlexRow = new Utilities(enableAdditionalContentWithFlexRowConfig);

context('Additional content', () => {

    beforeEach(() => {
    });

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

});
