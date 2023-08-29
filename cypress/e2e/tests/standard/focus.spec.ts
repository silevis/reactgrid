import { visit } from '../../common/visit';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Focus', () => {

    beforeEach(() => {
        visit();
    });

    it('Select one cell in click without selection key meta or ctrl', () => { // ✅
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 2) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 4) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 6) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 8) - 10);
        utils.getCellFocus().should('be.visible');
        utils.selectCell((config.cellWidth * 2) - 10, (config.cellHeight * 10) - 10);
        utils.getCellFocus().should('be.visible');
    });

    it('CTRL or META + end should select cell in first row and column ', () => { // ✅
        utils.selectCell(config.rgViewportWidth - config.cellWidth - utils.getCellXCenter(), config.cellHeight * 4 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.Home, { metaKey: true, ctrlKey: !utils.isMacOs() && true, force: true });

        cy.wait(utils.wait());
        utils.assertElementLeftIsEqual(utils.getCellFocus(), 0);
        cy.wait(utils.wait());
        utils.assertElementTopIsEqual(utils.getCellFocus(), 0);
    })

    it('CTRL or META + home should select cell in last row and column', () => { // ✅
        utils.selectCell(config.rgViewportWidth - config.cellWidth - utils.getCellXCenter(), config.cellHeight * 4 + utils.getCellYCenter());
        utils.keyDown(constants.keyCodes.End, { metaKey: true, ctrlKey: !utils.isMacOs() && true, force: true });

        cy.wait(utils.wait());
        utils.assertElementLeftIsEqual(utils.getCellFocus(), config.cellWidth * (config.columns - 1) - config.lineWidth);
        cy.wait(utils.wait());
        utils.assertElementTopIsEqual(utils.getCellFocus(), config.cellHeight * (config.rows - 1) - config.lineWidth);
    })

});
