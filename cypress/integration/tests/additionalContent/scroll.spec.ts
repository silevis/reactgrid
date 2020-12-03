import { visitAdditionalContent } from '../../common/visit';
import { Utilities } from '../../common/utils';
import { enableAdditionalContentConfig as config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Additional content', () => {

    beforeEach(() => {
        visitAdditionalContent();
    });

    it('', () => { // ✅

    });

});