import { enablePinnedToBodyConfig as config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visitStickyPinnedToBody } from '../../common/visit';
import { constants } from '../../common/constants';


const utils = new Utilities(config);

context('Cell editor position', () => {

  beforeEach(() => {
    visitStickyPinnedToBody();
  });

  it('should open cell editor on scrollable on NON scrolled view', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * (config.stickyLeft + 1),
          y: config.cellHeight * (config.stickyTop + 1),
        },
      },
      {
        click: {
          x: config.cellWidth * (config.stickyLeft + 1),
          y: config.cellHeight * (config.stickyTop + 12),
        },
      }
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrollable on scrolled view', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * (config.stickyLeft + 2),
          y: config.cellHeight * (config.stickyTop + 1),
        },
        scroll: {
          x: config.cellWidth * 1,
          y: config.cellHeight * 1,
        },
      },
      {
        click: {
          x: config.cellWidth * (config.stickyLeft + 2),
          y: config.cellHeight * (config.stickyTop + 6),
        },
        scroll: {
          x: config.cellWidth * 6,
          y: config.cellHeight * 8,
        },
      }
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on NON scrolled left sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 1,
          y: config.cellHeight * (config.stickyTop + 5),
        },
      },
      {
        click: {
          x: config.cellWidth * 3,
          y: config.cellHeight * (config.stickyTop + 16),
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on scrolled left sticky', () => {
    [
      {
        click: {
          x: config.cellWidth * 1,
          y: config.cellHeight * (config.stickyTop + 1),
        },
        scroll: {
          x: config.cellWidth * 1,
          y: config.cellHeight * 1,
        },
      },
      // {
      //   click: {
      //     x: config.cellWidth * 1,
      //     y: config.cellHeight * (config.stickyTop + 5),
      //   },
      //   scroll: {
      //     x: config.cellWidth * 2,
      //     y: config.cellHeight * 6,
      //   },
      // },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on NON scrolled top-left sticky', () => {
    [
      {
        click: {
          x: config.cellWidth * 1,
          y: config.cellHeight * 1,
        },
      },
      {
        click: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 2,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on scrolled top-left sticky', () => {
    // [
    //   {
    //     click: {
    //       x: config.cellWidth * 1,
    //       y: config.cellHeight * 1,
    //     },
    //   },
    //   {
    //     click: {
    //       x: config.cellWidth * 2,
    //       y: config.cellHeight * 2,
    //     },
    //   },
    // ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on NON scrolled top sticky', () => {
    [
      {
        click: {
          x: config.cellWidth * 10,
          y: config.cellHeight * 1,
        },
      },
      {
        click: {
          x: config.cellWidth * 12,
          y: config.cellHeight * 2,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on scrolled top sticky', () => {
    [
      {
        click: {
          x: config.cellWidth * 10,
          y: config.cellHeight * 1,
        },
        scroll: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 10,
        },
      },
      {
        click: {
          x: config.cellWidth * 12,
          y: config.cellHeight * 2,
        },
        scroll: {
          x: config.cellWidth * 7,
          y: config.cellHeight * 3,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('cell editor should be fully visible on double click on horizontally partially visible cell focus', () => {
    utils.selectCell(config.cellWidth * 4, config.cellHeight * 3);
    utils.getCellFocus().should('be.visible');
    utils.scrollTo(config.cellWidth / 2, 0);

    utils.keyDown(constants.keyCodes.Enter, { force: true }, 20, false);
    utils.getCellEditor().then($el => {
      const elementRect = $el[0].getBoundingClientRect();
      utils.assertElementLeftIsEqual(utils.getCellEditor(), utils.round(elementRect.left));
    });
  });

  it.skip('cell editor should be fully visible on double click on vertically partially visible cell focus', () => {
    utils.selectCell(config.cellWidth * 4, config.cellHeight * 6);
    utils.getCellFocus().should('be.visible');
    utils.scrollTo(0, config.cellHeight * 1.5);

    utils.keyDown(constants.keyCodes.Enter, { force: true }, 20, false);
    utils.getCellEditor().then($el => {
      const elementRect = $el[0].getBoundingClientRect();
      utils.assertElementTopIsEqual(utils.getCellEditor(), utils.round(elementRect.top));
    });
  });

});
