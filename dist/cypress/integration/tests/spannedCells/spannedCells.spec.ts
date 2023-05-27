import { visitSpannedCells } from '../../common/visit';
import { Utilities } from '../../common/utils';
import { enableSpannedCells as config } from '../../../../src/test/testEnvConfig';

const utils = new Utilities(config);

context('Spanning', () => {

    beforeEach(() => {
        visitSpannedCells();
    });

    it('should span cells in both axes', () => {
        const { idx, idy, colspan = 1, rowspan = 1 } = utils.getConfig().spannedCells[0];

        utils.assertElementWidthIsEqual(utils.getCell(idx, idy), utils.getConfig().cellWidth * colspan);
        utils.assertElementHeightIsEqual(utils.getCell(idx, idy), utils.getConfig().cellHeight * rowspan);
    });

    it('should span cells horizontally', () => {
        const { idx, idy, colspan = 1, rowspan = 1 } = utils.getConfig().spannedCells[1];

        utils.assertElementWidthIsEqual(utils.getCell(idx, idy), utils.getConfig().cellWidth * colspan);
        utils.assertElementHeightIsEqual(utils.getCell(idx, idy), utils.getConfig().cellHeight * rowspan);
    });

    it('should span cells vertically', () => {
        const { idx, idy, colspan = 1, rowspan = 1 } = utils.getConfig().spannedCells[2];

        utils.assertElementWidthIsEqual(utils.getCell(idx, idy), utils.getConfig().cellWidth * colspan);
        utils.assertElementHeightIsEqual(utils.getCell(idx, idy), utils.getConfig().cellHeight * rowspan);
    });


    it('should render cell highlight on a spanned cell', () => {
        const { colspan = 1, rowspan = 1 } = utils.getConfig().spannedCells[0];

        utils.assertElementWidthIsEqual(utils.getCellHighlight().eq(0), utils.getConfig().cellWidth * colspan + 1);
        utils.assertElementHeightIsEqual(utils.getCellHighlight().eq(0), utils.getConfig().cellHeight * rowspan + 1);

    });

});
