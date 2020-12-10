import { config } from '../../../../src/test/testEnvConfig';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { visit } from '../../common/visit';

const utils = new Utilities(config);

context('Cell editor position', () => {

    beforeEach(() => {
        visit();
    });

    it('should open fixed cell editor on non scrolled view', () => {

    });

    it.only('should open fixed cell editor on x axis scrolled view', () => {

        const click = {
            x: config.cellWidth * 1,
            y: 1,
        }

        const scroll = {
            x: 1610,
            // x: 3,
            y: 0,
        }

        const leftToReactgrid = click.x + scroll.x;
        const topToReactgrid = click.y + scroll.y;

        utils.scrollTo(scroll.x, scroll.y);
        utils.selectCellInEditMode(click.x, click.y);

        utils.getCellEditor().then($c => {
            const cellEditor = $c[0];
            utils.getReactGrid().then($r => {
                const reBoundingRect = $r[0].getBoundingClientRect();
                cy.log(`${scroll.x % click.x === 0 ? 0 : reBoundingRect.left + scroll.x}`);
                const expectedLeft =
                    reBoundingRect.left
                    + scroll.x
                    // + click.x
                    + (scroll.x % click.x === 0 ? 0 : config.cellWidth - (scroll.x % click.x))
                    - 1;
                expect(`${expectedLeft}px`).to.be.equal(cellEditor.style.left, 'Left distance');
            });
        });
    });

    it('should open fixed cell editor on Y scrolled view', () => {
    });

});
