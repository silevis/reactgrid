import { config } from '../../../../src/test/testEnvConfig';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { visit } from '../../common/visit';

const utils = new Utilities(config);

context('Cell editor position', () => {

    beforeEach(() => {
        visit();
    });

    it.skip('should open fixed cell editor on non scrolled view', () => {

    });

    it.only('should open fixed cell editor on both axis scrolled view', () => {

        const clickOne = {
            x: config.cellWidth * 1,
            y: config.cellHeight * 1,
        }
        const scroll = {
            x: 120,
            y: 32,
        }

        utils.scrollTo(scroll.x, scroll.y);
        utils.selectCellInEditMode(clickOne.x, clickOne.y);

        utils.assertCellEditorPosition(scroll, clickOne);

        utils.resetSelection(0, 0);

        // ============

        const scrollTwo = {
            x: utils.getRandomInt(200, 400),
            y: utils.getRandomInt(300, 700),
        }
        const clickTwo = {
            x: config.cellWidth * 2,
            y: config.cellHeight * 2,
        }

        utils.scrollTo(scrollTwo.x, scrollTwo.y);
        utils.selectCellInEditMode(clickTwo.x, clickTwo.y);

        utils.assertCellEditorPosition(scrollTwo, clickTwo);

    });

    it.skip('should open fixed cell editor on Y scrolled view', () => {

    });

    it.skip('should open fixed cell editor on X axis scrolled view', () => {

    });

});
