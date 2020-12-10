import { config } from '../../../../src/test/testEnvConfig';
import { constants } from '../../common/constants';
import { Utilities } from '../../common/utils';
import { visitSticky } from '../../common/visit';

const utils = new Utilities(config);

context('Cell editor position', () => {

    beforeEach(() => {
        visitSticky();
    });

    it.only('should open cell editor on scrolled view', () => {

    });

    it.skip('should open cell editor on scrolled left sticky', () => {

    });

    it.skip('should open cell editor on NON scrolled top-left sticky', () => {

    });

    it.skip('should open cell editor on scrolled top-left sticky', () => {

    });

    it.skip('should open cell editor on NON scrolled top sticky', () => {

    });

    it.skip('should open cell editor on scrolled top sticky', () => {

    });

    it.skip('should open cell editor on NON scrolled left sticky', () => {

    });

    it.skip('should open cell editor on scrolled left sticky', () => {

    });

});
