import { config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visitSticky } from '../../common/visit';

const utils = new Utilities(config);

context('Cell editor position', () => {

  beforeEach(() => {
    visitSticky();
  });

  it('should open cell editor on NON scrolled view', () => { // ✅
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
        y: config.cellHeight * (config.stickyTop + 17),
      },
      scroll: {
        x: 0,
        y: 0,
      },
    }].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on scrolled view', () => { // ✅
    [{
      click: {
        x: config.cellWidth * (config.stickyLeft + 1),
        y: config.cellHeight * (config.stickyTop + 1),
      },
      scroll: {
        x: 2000,
        y: 20,
      },
    },
    {
      click: {
        x: config.cellWidth * (config.stickyLeft + 3),
        y: config.cellHeight * (config.stickyTop + 17),
      },
      scroll: {
        x: 80,
        y: 800,
      },
    }].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it('should open cell editor on NON scrolled left sticky', () => {
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
          y: config.cellHeight * (config.stickyTop + 16),
        },
        scroll: {
          x: 0,
          y: 0,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on scrolled left sticky', () => {
    [
      {
        click: {
          x: config.cellWidth * 2 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * (config.stickyTop + 3),
        },
        scroll: {
          x: 150,
          y: 200,
        },
      },
      {
        click: {
          x: config.cellWidth * 1 - (config.stickyLeft ? 1 : 0),
          y: config.cellHeight * (config.stickyTop + 16),
        },
        scroll: {
          x: 305,
          y: 200,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on NON scrolled top-left sticky', () => {
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
          y: config.cellHeight * 3 - (config.stickyTop ? 1 : 0),
        },
        scroll: {
          x: 0,
          y: 0,
        },
      },
    ].forEach(utils.testCellEditorOnSticky.bind(utils));
  });

  it.skip('should open cell editor on scrolled top-left sticky', () => {

  });

  it.skip('should open cell editor on NON scrolled top sticky', () => {

  });

  it.skip('should open cell editor on scrolled top sticky', () => {

  });



  it.skip('should open cell editor on scrolled left sticky', () => {

  });

});
