import { enableSymetric as config } from '../../../../src/test/testEnvConfig';
import { Utilities } from '../../common/utils';
import { visitSymetric } from '../../common/visit';

const utils = new Utilities(config);

context('Cell editor position on PRO', () => {

  beforeEach(() => {
    visitSymetric();
  });

  // const reactGridRightEdge = config.rgViewportWidth - 15; // === clientWidth

  it('should open cell editor on NON scrolled top-right sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientWidth } = $sc[0];
      [
        {
          click: {
            x: clientWidth,
            y: config.cellHeight,
          },
        },
        {
          click: {
            x: clientWidth - (config.cellHeight * 1),
            y: config.cellHeight * 2,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on scrolled top-right sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientWidth } = $sc[0];
      [
        {
          click: {
            x: clientWidth,
            y: config.cellHeight * 1,
          },
          scroll: {
            x: config.cellWidth * 2,
            y: config.cellHeight * 10,
          },
        },
        {
          click: {
            x: clientWidth - (config.cellHeight * 1),
            y: config.cellHeight * 2,
          },
          scroll: {
            x: config.cellWidth * 7,
            y: config.cellHeight * 3,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on NON scrolled right sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientWidth } = $sc[0];
      [
        {
          click: {
            x: clientWidth,
            y: config.cellHeight * (config.stickyTop + 1),
          },
        },
        {
          click: {
            x: clientWidth - config.cellWidth,
            y: config.cellHeight * (config.stickyTop + 6),
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on scrolled right sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientWidth } = $sc[0];
      [
        {
          click: {
            x: clientWidth,
            y: config.cellHeight * (config.stickyTop + 1),
          },
          scroll: {
            x: config.cellWidth * 2,
            y: config.cellHeight * 10,
          },
        },
        {
          click: {
            x: clientWidth - config.cellWidth,
            y: config.cellHeight * (config.stickyTop + 6),
          },
          scroll: {
            x: config.cellWidth * 7,
            y: config.cellHeight * 3,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on NON scrolled bottom-right sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientWidth, clientHeight } = $sc[0];
      [
        {
          click: {
            x: clientWidth,
            y: clientHeight,
          },
        },
        {
          click: {
            x: clientWidth - config.cellWidth,
            y: clientHeight - config.cellHeight,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on scrolled bottom-right sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientWidth, clientHeight } = $sc[0];
      [
        {
          click: {
            x: clientWidth,
            y: clientHeight,
          },
          scroll: {
            x: config.cellWidth * 2,
            y: config.cellHeight * 13,
          },
        },
        {
          click: {
            x: clientWidth - config.cellWidth,
            y: clientHeight - config.cellHeight,
          },
          scroll: {
            x: config.cellWidth * 4,
            y: config.cellHeight * 20,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on NON scrolled bottom sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientHeight } = $sc[0];
      [
        {
          click: {
            x: config.cellWidth * (config.stickyLeft + 1),
            y: clientHeight,
          },
        },
        {
          click: {
            x: config.cellWidth * (config.stickyLeft + 10),
            y: clientHeight - config.cellHeight,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on scrolled bottom sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientHeight } = $sc[0];
      [
        {
          click: {
            x: config.cellWidth * (config.stickyLeft + 1),
            y: clientHeight,
          },
          scroll: {
            x: config.cellWidth * 2,
            y: config.cellHeight * 13,
          },
        },
        {
          click: {
            x: config.cellWidth * (config.stickyLeft + 10),
            y: clientHeight - config.cellHeight,
          },
          scroll: {
            x: config.cellWidth * 4,
            y: config.cellHeight * 13,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on NON scrolled bottom-left sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientHeight } = $sc[0];
      [
        {
          click: {
            x: (config.cellWidth * 1),
            y: clientHeight,
          },
        },
        {
          click: {
            x: (config.cellWidth * 2),
            y: clientHeight - config.cellHeight,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it('should open cell editor on scrolled bottom-left sticky', () => { // ✅
    utils.getScrollableElement().then($sc => {
      const { clientHeight } = $sc[0];
      [
        {
          click: {
            x: (config.cellWidth * 1),
            y: clientHeight,
          },
          scroll: {
            x: config.cellWidth * 2,
            y: config.cellHeight * 13,
          },
        },
        {
          click: {
            x: (config.cellWidth * 2),
            y: clientHeight - config.cellHeight,
          },
          scroll: {
            x: config.cellWidth * 5,
            y: config.cellHeight * 20,
          },
        },
      ].forEach(utils.testCellEditorOnSticky.bind(utils));
    });
  });

  it.skip('cell editor should be fully visible on double click on partially visible cell focus', () => {
    // 🟠 TODO fix it
  });

});
