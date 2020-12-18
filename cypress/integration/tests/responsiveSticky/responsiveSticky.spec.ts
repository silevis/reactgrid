import { visitResponsiveSticky } from '../../common/visit';
import { Utilities } from '../../common/utils';
import { enableResponsiveSticky as config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Responsive sticky', () => {

    beforeEach(() => {
        cy.viewport(500, 600);
        visitResponsiveSticky();
    });

    it.only('Sticky shouldn`t display on narrow view', () => { // ✅
        utils.getTopStickyPane().should('not.exist');
        utils.getLeftStickyPane().should('not.exist');;
    });

});
