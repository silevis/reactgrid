import { enablePinnedToBodyConfig as config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visitStickyPinnedToBody } from '../../common/visit';

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

  it.skip('cell editor should be fully visible on double click on partially visible cell focus', () => {
    // 🟠 TODO fix it
  });

});
