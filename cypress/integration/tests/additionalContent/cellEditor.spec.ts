import { Utilities } from '../../common/utils';
import { visitAdditionalContent, visitAdditionalContentWithFlexRow } from '../../common/visit';
import {
  enableAdditionalContentConfig, enableAdditionalContentWithFlexRowConfig
} from '../../../../src/test/testEnvConfig';

const utils = new Utilities(enableAdditionalContentConfig);
const utilsFlexRow = new Utilities(enableAdditionalContentWithFlexRowConfig);

context('Cell editor position', () => {

  beforeEach(() => {
  });

  it('should open fixed cell editor on partially visible additional content', () => { // ✅
    visitAdditionalContent();
    [
      {
        click: {
          x: utils.getConfig().cellWidth * 1,
          y: utils.getConfig().cellHeight * 20,
        },
        scroll: {
          x: 0,
          y: utils.getConfig().rgViewportHeight / 2 + 10,
        },
      },
      {
        click: {
          x: utils.getConfig().cellWidth * 6,
          y: utils.getConfig().cellHeight * 18,
        },
        scroll: {
          x: 0,
          y: utils.getConfig().cellHeight + utils.getConfig().rgViewportHeight / 2 + 22,
        },
      }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it.only('should open fixed cell editor on both axis scrolled view', () => { // ✅
    visitAdditionalContent();
    [
      {
        click: {
          x: utils.getConfig().cellWidth * 1,
          y: utils.getConfig().cellHeight * 2,
        },
        scroll: {
          x: utils.getConfig().cellWidth + 10,
          y: utils.getConfig().cellHeight + utils.getConfig().rgViewportHeight + 12,
        },
      },
      {
        click: {
          x: utils.getConfig().cellWidth * utils.getRandomInt(1, 5),
          y: utils.getConfig().cellHeight * utils.getRandomInt(1, 15),
        },
        scroll: {
          x: utils.getConfig().cellWidth * 20 + utils.getRandomInt(1, utils.getConfig().cellWidth),
          y: utils.getConfig().cellHeight * 10 + utils.getRandomInt(1, utils.getConfig().cellHeight) + utils.getConfig().rgViewportHeight,
        },
      }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open a cell editor in the vertically scrolled view', () => { // ✅
    visitAdditionalContent();
    [
      {
        click: {
          x: utils.getConfig().cellWidth * 4,
          y: utils.getConfig().cellHeight * 5,
        },
        scroll: {
          x: 0,
          y: utils.getConfig().cellHeight + 10 + utils.getConfig().rgViewportHeight,
        },
      },
      {
        click: {
          x: utils.getConfig().cellWidth * utils.getRandomInt(1, 5),
          y: utils.getConfig().cellHeight * utils.getRandomInt(1, 15),
        },
        scroll: {
          x: 0,
          y: utils.getConfig().cellHeight * 25 + utils.getRandomInt(1, utils.getConfig().cellHeight) + utils.getConfig().rgViewportHeight,
        },
      }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it.skip('should open fixed cell editor on partially visible additional content with flex row', () => {
    visitAdditionalContentWithFlexRow();

    [
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 1,
          y: utilsFlexRow.getConfig().cellHeight * 11,
        },
        scroll: {
          x: utilsFlexRow.getConfig().rgViewportWidth,
          y: 0,
        },
      },
      // {
      //   click: {
      //     x: utilsFlexRow.getConfig().cellWidth * 6,
      //     y: utils.getConfig().cellHeight * 18,
      //   },
      //   scroll: {
      //     x: 0,
      //     y: utilsFlexRow.getConfig().rgViewportHeight / 2,
      //   },
      // }
    ].forEach(utilsFlexRow.testCellEditor.bind(utilsFlexRow));
  });

  it.skip('should open fixed cell editor on both axis scrolled view with flex row', () => {
    visitAdditionalContentWithFlexRow();
    [
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 1,
          y: utilsFlexRow.getConfig().cellHeight * 2,
        },
        scroll: {
          x: utilsFlexRow.getConfig().cellWidth + 10,
          y: utilsFlexRow.getConfig().cellHeight + utilsFlexRow.getConfig().rgViewportHeight,
        },
      },
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * utilsFlexRow.getRandomInt(1, 5),
          y: utilsFlexRow.getConfig().cellHeight * utilsFlexRow.getRandomInt(1, 15),
        },
        scroll: {
          x: utilsFlexRow.getConfig().cellWidth * 20 + utilsFlexRow.getRandomInt(1, utilsFlexRow.getConfig().cellWidth),
          y: utilsFlexRow.getConfig().cellHeight * 25 + utilsFlexRow.getRandomInt(1, utilsFlexRow.getConfig().cellHeight) + utilsFlexRow.getConfig().rgViewportHeight,
        },
      }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it.skip('should open a cell editor in the vertically scrolled view with flex row', () => {
    visitAdditionalContentWithFlexRow();
    [
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 4,
          y: utilsFlexRow.getConfig().cellHeight * 5,
        },
        scroll: {
          x: 0,
          y: utilsFlexRow.getConfig().cellHeight + 10 + utilsFlexRow.getConfig().rgViewportHeight,
        },
      },
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * utilsFlexRow.getRandomInt(1, 5),
          y: utilsFlexRow.getConfig().cellHeight * utilsFlexRow.getRandomInt(1, 15),
        },
        scroll: {
          x: 0,
          y: utilsFlexRow.getConfig().cellHeight * 25 + utilsFlexRow.getRandomInt(1, utilsFlexRow.getConfig().cellHeight) + utils.getConfig().rgViewportHeight,
        },
      }
    ].forEach(utilsFlexRow.testCellEditor.bind(utilsFlexRow));
  });

  it.skip('cell editor should be fully visible on double click on partially visible cell focus', () => {
    // 🟠 TODO fix it
  });

});
