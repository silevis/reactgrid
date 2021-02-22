import { enablePinnedToBodyConfig as config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visitPinnedToBody } from '../../common/visit';

const utils = new Utilities(config);

context('Cell editor position', () => {

  beforeEach(() => {
    visitPinnedToBody();
  });

  it('should open fixed cell editor on non scrolled view', () => {// ✅
    [{
      click: {
        x: config.cellWidth * 3,
        y: config.cellHeight * 2,
      },
    },
    {
      click: {
        x: config.cellWidth * 6,
        y: config.cellHeight * 14,
      },
    }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open fixed cell editor on both axis scrolled view', () => {// ✅
    [{
      click: {
        x: config.cellWidth * 1,
        y: config.cellHeight * 1,
      },
      scroll: {
        x: config.cellWidth,
        y: config.cellHeight,
      },
    },
    {
      click: {
        x: config.cellWidth * utils.getRandomInt(1, 5),
        y: config.cellHeight * utils.getRandomInt(1, 15),
      },
      scroll: {
        x: config.cellWidth * 20 + utils.getRandomInt(1, config.cellWidth),
        y: config.cellHeight * 25 + utils.getRandomInt(1, config.cellHeight),
      },
    },
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open a cell editor in the vertically scrolled view', () => {// ✅
    [{
      click: {
        x: config.cellWidth * 4,
        y: config.cellHeight * 5,
      },
      scroll: {
        x: 0,
        y: config.cellHeight,
      },
    }, {
      click: {
        x: config.cellWidth * utils.getRandomInt(1, 5),
        y: config.cellHeight * utils.getRandomInt(1, 15),
      },
      scroll: {
        x: 0,
        y: config.cellHeight * utils.getRandomInt(10, 30) + utils.getRandomInt(1, config.cellHeight),
      },
    }].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open a cell editor in the horizontally scrolled view', () => {// ✅
    [{
      click: {
        x: config.cellWidth * 4,
        y: config.cellHeight * 3,
      },
      scroll: {
        x: config.cellWidth * 2,
        y: 0,
      },
    }, {
      click: {
        x: config.cellWidth * 4,
        y: config.cellHeight * 15,
      },
      scroll: {
        x: config.cellWidth * 20 + 65,
        y: 0,
      },
    }].forEach(utils.testCellEditor.bind(utils));
  });

  it.skip('cell editor should be fully visible on double click on partially visible cell focus', () => {
    // 🟠 TODO fix it
  });

});
