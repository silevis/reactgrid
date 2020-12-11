import { config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visit } from '../../common/visit';

const utils = new Utilities(config);

context('Cell editor position', () => {

  beforeEach(() => {
    visit();
  });

  it('should open fixed cell editor on non scrolled view', () => { // ✅
    [{
      click: {
        x: config.cellWidth * 1,
        y: config.cellHeight * 1,
      },
      scroll: {
        x: 0,
        y: 0,
      },
    }, {
      click: {
        x: config.cellWidth * 6,
        y: config.cellHeight * 14,
      },
      scroll: {
        x: 0,
        y: 0,
      },
    }].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open fixed cell editor on both axis scrolled view', () => { // ✅
    [{
      click: {
        x: config.cellWidth * 1,
        y: config.cellHeight * 1,
      },
      scroll: {
        x: 120,
        y: 32,
      },
    }, {
      click: {
        x: utils.getRandomInt(200, 400),
        y: utils.getRandomInt(300, 700),
      },
      scroll: {
        x: config.cellWidth * 2,
        y: config.cellHeight * 2,
      },
    }].forEach(utils.testCellEditor.bind(utils));
  });

  it.skip('should open fixed cell editor on Y scrolled view', () => {

  });

  it.skip('should open fixed cell editor on X axis scrolled view', () => {

  });

});
