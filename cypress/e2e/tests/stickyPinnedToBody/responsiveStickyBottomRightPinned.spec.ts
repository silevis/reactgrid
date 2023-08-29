import { Utilities } from '../../common/utils';
import { enableBottomRightResponsiveStickyPinnedToBody as config } from '../../../../src/test/testEnvConfig';
import { visitResponsiveStickyPinnedToBodyBottomRight } from '../../common/visit';

const utils = new Utilities(config);

context('Responsive bottom and right sticky pinned to body', () => {

    beforeEach(() => {
        cy.viewport(500, 600);
        visitResponsiveStickyPinnedToBodyBottomRight();
    });

    it('Right and Bottom sticky shouldn`t display on narrow view', () => { // ✅
        cy.viewport(500, 600);
        utils.getRightStickyPane().should('not.exist');
        utils.getBottomStickyPane().should('not.exist');
    });

    it('Only bottom sticky should display on narrow view', () => { // ✅
        cy.viewport(500, 900);
        utils.getBottomStickyPane().should('exist');
        utils.getRightStickyPane().should('not.exist');
    });

    it('Only right sticky should display on narrow view', () => { // ✅
        cy.viewport(900, 500);
        utils.getBottomStickyPane().should('not.exist');
        utils.getRightStickyPane().should('exist');
    });

});
