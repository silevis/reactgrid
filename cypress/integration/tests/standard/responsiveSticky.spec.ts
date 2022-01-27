import { visitResponsiveStickyTopLeft } from '../../common/visit';
import { Utilities } from '../../common/utils';
import { enableTopLeftResponsiveSticky as config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Responsive sticky', () => {

    beforeEach(() => {
        cy.viewport(500, 600);
        visitResponsiveStickyTopLeft();
    });

    it('Sticky shouldn`t display on narrow view', () => { // ✅
        utils.getTopStickyPane().should('not.exist');
        utils.getLeftStickyPane().should('not.exist');
    });

    it('Only top sticky should display on narrow view', () => {
        cy.viewport(500, 900);
        utils.getTopStickyPane().should('exist');
        utils.getLeftStickyPane().should('not.exist');
    });

    it('Only left sticky should display on narrow view', () => {
        cy.viewport(900, 500);
        utils.getTopStickyPane().should('not.exist');
        utils.getLeftStickyPane().should('exist');
    });

});
