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

  // 🟠 Fails on cell focus visibility tests for some reason despite being visible in test
  it.skip('cell editor should be fully visible on double click on horizontally partially visible cell focus', () => { 
    utils.selectCell((utils.getConfig().cellWidth * 4) - 10, (utils.getConfig().cellHeight * 3) - 10);
    utils.getCellFocus().should('be.visible');
    utils.scrollTo(utils.getCellXCenter(), 0);
    cy.wait(utils.wait());
    utils.keyDown(constants.keyCodes.ArrowDown, { force: true }, 20, false);

    cy.window().its('scrollX').then($scrollLeft => {
      const firstScrollValue = utils.round($scrollLeft);
      utils.scrollTo(utils.getCellXCenter(), 0);
      utils.keyDown(constants.keyCodes.Enter, { force: true }, 20, false);
      cy.window().its('scrollX').then($scrollLeft2 => {
        cy.wait(utils.wait());
        const secondScrollValue = utils.round($scrollLeft2);
        expect(firstScrollValue, 'Scroll left').to.be.equal(secondScrollValue);
      });
    });
  });

  // 🟠 Fails on cell focus visibility tests for some reason despite being visible in test
  it.skip('cell editor should be fully visible on double click on vertically partially visible cell focus', () => { 
    utils.selectCell((utils.getConfig().cellWidth * 3) - 10, (utils.getConfig().cellHeight * 7) - 10);
    utils.getCellFocus().should('be.visible');
    utils.scrollTo(0, utils.getConfig().cellHeight + utils.getCellYCenter());
    cy.wait(utils.wait());
    utils.keyDown(constants.keyCodes.ArrowRight, { force: true }, 20, false);

    cy.window().its('scrollY').then($scrollTop => {
      const firstScrollValue = utils.round($scrollTop);
      utils.scrollTo(0, utils.getConfig().cellHeight + utils.getCellYCenter());
      utils.keyDown(constants.keyCodes.Enter, { force: true }, 20, false);
      cy.window().its('scrollY').then($scrollTop2 => {
        cy.wait(utils.wait());
        const secondScrollValue = utils.round($scrollTop2);
        expect(firstScrollValue, 'Scroll Top').to.be.equal(secondScrollValue);
      });
    });
  });
});