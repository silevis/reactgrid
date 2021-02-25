import { Utilities } from '../../common/utils';
import { visitAdditionalContent, visitAdditionalContentWithFlexRow } from '../../common/visit';
import {
  enableAdditionalContentConfig, enableAdditionalContentWithFlexRowConfig
} from '../../../../src/test/testEnvConfig';
import { constants } from '../../common/constants';

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

  it('should open fixed cell editor on both axis scrolled view', () => { // ✅
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
          y: utils.getConfig().cellHeight * 25 + utils.getConfig().rgViewportHeight,
        },
      }
    ].forEach(utils.testCellEditor.bind(utils));
  });

  it('should open fixed cell editor on partially visible additional content with a flex row', () => {
    visitAdditionalContentWithFlexRow();

    [
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 3,
          y: utilsFlexRow.getConfig().cellHeight * 3,
        },
        scroll: {
          x: utilsFlexRow.getConfig().rgViewportWidth - utilsFlexRow.getConfig().cellWidth * 2,
          y: utilsFlexRow.getConfig().cellHeight * 1,
        },
      },
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 5,
          y: utilsFlexRow.getConfig().cellHeight * 3,
        },
        scroll: {
          x: utilsFlexRow.getConfig().rgViewportWidth - utilsFlexRow.getConfig().cellWidth * 4,
          y: utilsFlexRow.getConfig().cellHeight * 10,
        },
      },
    ].forEach(utilsFlexRow.testCellEditor.bind(utilsFlexRow));
  });

  it('should open fixed cell editor on both axis scrolled view with a flex row', () => {
    visitAdditionalContentWithFlexRow();
    console.log(utilsFlexRow.getConfig().flexRow);

    [
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 2,
          y: utilsFlexRow.getConfig().cellHeight * 2,
        },
        scroll: {
          x: utilsFlexRow.getConfig().rgViewportWidth + utilsFlexRow.getConfig().cellWidth * 1,
          y: utilsFlexRow.getConfig().cellHeight * 1,
        },
      },
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 7,
          y: utilsFlexRow.getConfig().cellHeight * 14,
        },
        scroll: {
          x: utilsFlexRow.getConfig().rgViewportWidth + utilsFlexRow.getConfig().cellWidth * 10,
          y: utilsFlexRow.getConfig().cellHeight * 20,
        },
      },
    ].forEach(utilsFlexRow.testCellEditor.bind(utilsFlexRow));
  });

  it('should open a cell editor in the horizontally scrolled view with a flex row', () => {
    visitAdditionalContentWithFlexRow();
    [
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 4,
          y: utilsFlexRow.getConfig().cellHeight * 5,
        },
        scroll: {
          x: utilsFlexRow.getConfig().rgViewportWidth + utilsFlexRow.getConfig().cellWidth * 10,
          y: 0,
        },
      },
      {
        click: {
          x: utilsFlexRow.getConfig().cellWidth * 2,
          y: utilsFlexRow.getConfig().cellHeight * 5,
        },
        scroll: {
          x: utilsFlexRow.getConfig().rgViewportWidth
            + utilsFlexRow.getConfig().cellWidth * utilsFlexRow.getConfig().columns
            - utilsFlexRow.getConfig().cellWidth * 4
          ,
          y: 0,
        },
      },
    ].forEach(utilsFlexRow.testCellEditor.bind(utilsFlexRow));
  });

  it('cell editor should be fully visible on double click on horizontally partially visible cell focus', () => { // ✅ 
    visitAdditionalContentWithFlexRow();
    utils.scrollTo(utilsFlexRow.getConfig().rgViewportWidth, 0);
    utils.selectCell((utilsFlexRow.getConfig().cellWidth * 3) - 10, (utilsFlexRow.getConfig().cellHeight * 3) - 10);
    utils.scrollTo(utilsFlexRow.getConfig().rgViewportWidth + utilsFlexRow.getConfig().cellWidth * 3 - utilsFlexRow.getConfig().cellWidth / 2, 0);
    utils.getCellFocus().should('be.visible');
    utils.keyDown(constants.keyCodes.Enter, { force: true }, 20, false);
    utils.getCellEditor().then($el => {
      const elementRect = $el[0].getBoundingClientRect();
      utils.assertElementLeftIsEqual(utils.getCellEditor(), elementRect.left);
    });
  });

  it('cell editor should be fully visible on double click on vertically partially visible cell focus', () => { // ✅ 
    visitAdditionalContent();
    utils.scrollTo(0, utilsFlexRow.getConfig().rgViewportHeight);
    utils.selectCell((utilsFlexRow.getConfig().cellWidth * 3) - 10, (utilsFlexRow.getConfig().cellHeight * 3) - 10);
    utils.scrollTo(0, utilsFlexRow.getConfig().rgViewportHeight + utilsFlexRow.getConfig().cellHeight * 3 - utilsFlexRow.getConfig().cellHeight / 2);
    utils.getCellFocus().should('be.visible');
    utils.keyDown(constants.keyCodes.Enter, { force: true }, 20, false);
    utils.getCellEditor().then($el => {
      const elementRect = $el[0].getBoundingClientRect();
      utils.assertElementTopIsEqual(utils.getCellEditor(), elementRect.top);
    });
  });

});
