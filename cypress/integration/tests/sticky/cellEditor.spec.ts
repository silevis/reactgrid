import { enableSymetric as config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visitSymetric } from '../../common/visit';

const utils = new Utilities(config);

context('Cell editor position', () => {

  beforeEach(() => {
    visitSymetric();
  });

  it('should open cell editor on scrollable on NON scrolled view', () => { // ✅
    [{
      click: {
        x: config.cellWidth * (config.stickyLeft + 1) - 1,  // substracting 1 for get correct click cell on headless mode
        y: config.cellHeight * (config.stickyTop + 1) - 1,
      },
    }, {
      click: {
        x: config.cellWidth * (config.stickyLeft + 3) - 1,
        y: config.cellHeight * (config.stickyTop + 6) - 1,
      },
    }].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrollable on scrolled view', () => { // ✅
    [{
      click: {
        x: config.cellWidth * (config.stickyLeft + 1) - 1,
        y: config.cellHeight * (config.stickyTop + 1) - 1,
      },
      scroll: {
        x: config.cellWidth * 2,
        y: config.cellHeight * 3,
      },
    },
    {
      click: {
        x: config.cellWidth * (config.stickyLeft + 10) - 1,
        y: config.cellHeight * (config.stickyTop + 4) - 1,
      },
      scroll: {
        x: config.cellWidth * 2,
        y: config.cellHeight * 3,
      },
    }
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on NON scrolled left sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 1 - 1,
          y: config.cellHeight * (config.stickyTop + 5) - 1,
        },
      },
      {
        click: {
          x: config.cellWidth * 2 - 1,
          y: config.cellHeight * (config.stickyTop + 6) - 1,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrolled left sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 1 - 1,
          y: config.cellHeight * (config.stickyTop + 3) - 1,
        },
        scroll: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 3,
        },
      },
      {
        click: {
          x: config.cellWidth * 1 - 1,
          y: config.cellHeight * (config.stickyTop + 5) - 1,
        },
        scroll: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 6,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on NON scrolled top-left sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 1 - 1,
          y: config.cellHeight * 1 - 1,
        },
      },
      {
        click: {
          x: config.cellWidth * 2 - 1,
          y: config.cellHeight * 2 - 1,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrolled top-left sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 1 - 1,
          y: config.cellHeight * 1 - 1,
        },
      },
      {
        click: {
          x: config.cellWidth * 2 - 1,
          y: config.cellHeight * 2 - 1,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on NON scrolled top sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 10 - 1,
          y: config.cellHeight * 1 - 1,
        },
      },
      {
        click: {
          x: config.cellWidth * 12 - 1,
          y: config.cellHeight * 2 - 1,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrolled top sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 10 - 1,
          y: config.cellHeight * 1 - 1,
        },
        scroll: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 10,
        },
      },
      {
        click: {
          x: config.cellWidth * 12 - 1,
          y: config.cellHeight * 2 - 1,
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
