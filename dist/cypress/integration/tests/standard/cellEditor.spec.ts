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
    }, {
      click: {
        x: config.cellWidth * 6,
        y: config.cellHeight * 14,
      },
    }].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open fixed cell editor on both axis scrolled view', () => { // ✅ 
    [
      {
        click: {
          x: config.cellWidth * 1,
          y: config.cellHeight * 2,
        },
        scroll: {
          x: config.cellWidth + 10,
          y: config.cellHeight - 12,
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
      }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open a cell editor in the vertically scrolled view', () => { // ✅ 
    [
      {
        click: {
          x: config.cellWidth * 4,
          y: config.cellHeight * 5,
        },
        scroll: {
          x: 0,
          y: config.cellHeight + 10,
        },
      },
      {
        click: {
          x: config.cellWidth * utils.getRandomInt(1, 5),
          y: config.cellHeight * utils.getRandomInt(1, 15),
        },
        scroll: {
          x: 0,
          y: config.cellHeight * 25,
        },
      }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open a cell editor in the horizontally scrolled view', () => {  // ✅ 
    [
      {
        click: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 3,
        },
        scroll: {
          x: config.cellWidth * 2 + 2,
          y: 0,
        },
      },
      {
        click: {
          x: config.cellWidth * utils.getRandomInt(1, 5),
          y: config.cellHeight * utils.getRandomInt(1, 15),
        },
        scroll: {
          x: config.cellWidth * 20 + utils.getRandomInt(1, config.cellWidth),
          y: 0,
        },
      }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it.skip('cell editor should be fully visible on double click on partially visible cell focus', () => {
    // 🟠 TODO fix it
  });

});
