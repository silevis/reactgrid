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
        x: config.cellWidth * (config.stickyLeft + 1),
        y: config.cellHeight * (config.stickyTop + 1),
      },
      scroll: {
        x: 0,
        y: 0,
      },
    }, {
      click: {
        x: config.cellWidth * (config.stickyLeft + 3),
        y: config.cellHeight * (config.stickyTop + 6),
      },
      scroll: {
        x: 0,
        y: 0,
      },
    }].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrollable on scrolled view', () => { // ✅
    [{
      click: {
        x: config.cellWidth * (config.stickyLeft + 1),
        y: config.cellHeight * (config.stickyTop + 1),
      },
      scroll: {
        x: config.cellWidth * 2,
        y: config.cellHeight * 3,
      },
    },
    {
      click: {
        x: config.cellWidth * (config.stickyLeft + 10),
        y: config.cellHeight * (config.stickyTop + 4),
      },
      scroll: {
        x: config.cellWidth * 2,
        y: config.cellHeight * 3,
      },
    }].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on NON scrolled left sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 2 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * (config.stickyTop + 3),
        },
        scroll: {
          x: 0,
          y: 0,
        },
      },
      {
        click: {
          x: config.cellWidth * 1 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * (config.stickyTop + 6),
        },
        scroll: {
          x: 0,
          y: 0,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrolled left sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 1 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * (config.stickyTop + 3),
        },
        scroll: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 3,
        },
      },
      {
        click: {
          x: config.cellWidth * 1 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * (config.stickyTop + 5),
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
          x: config.cellWidth * 1 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * 1 - (config.stickyTop ? 1 : 0),
        },
        scroll: {
          x: 0,
          y: 0,
        },
      },
      {
        click: {
          x: config.cellWidth * 2 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * 2 - (config.stickyTop ? 1 : 0),
        },
        scroll: {
          x: 0,
          y: 0,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrolled top-left sticky', () => { // ✅
    [
      {
        click: {
          x: config.cellWidth * 1 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * 1 - (config.stickyTop ? 1 : 0),
        },
        scroll: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 3,
        },
      },
      {
        click: {
          x: config.cellWidth * 2 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * 2 - (config.stickyTop ? 1 : 0),
        },
        scroll: {
          x: config.cellWidth * 2,
          y: config.cellHeight * 6,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on NON scrolled top sticky', () => {

  });

  it.skip('should open cell editor on scrolled top sticky', () => {

  });

  it.skip('should open cell editor on scrolled left sticky', () => {

  });

  it.skip('cell editor should be fully visible on double click on partially visible cell focus', () => {
    // 🟠 TODO fix it
  });

});
