import { visit } from '../../common/visit';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Hidden focus', () => {

    beforeEach(() => {
        visit();
    });

    it('should capture text typing after cell selection', () => { // ✅
        cy.wait(utils.wait());
        utils.selectCell(config.cellWidth + (config.cellWidth / 2), config.cellHeight * 4);
        cy.wait(utils.wait());
        utils.keyDown(constants.keyCodes.Enter, { force: true }, 500, true);
        cy.wait(utils.wait());
        cy.focused().type(utils.randomText(), { force: true });
    });

    it('focus should back to grid on Shift + TAB key', () => {//  ✅
        utils.selectCell(config.cellWidth + (config.cellWidth / 2), config.cellHeight * 4);
        utils.getOuterInput().focus();
        cy.wait(utils.wait());
        (cy.focused().type('text', { force: true }) as any).tab({ shift: true });
        cy.wait(utils.wait());
        utils.assertIsReactGridFocused();
    });

    it('should be able to type text outside grid', () => { // ✅
        utils.getOuterInput().focus();
        cy.wait(utils.wait())
        cy.focused().invoke('val').should('be.empty');
        cy.focused().type(utils.randomText(), { force: true });
        cy.wait(utils.wait());
        cy.focused().invoke('val').should('not.be.empty');
        utils.selectCell(200, 100);
        cy.wait(utils.wait());
        utils.assertIsReactGridFocused();
    });

});
