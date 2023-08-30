/// <reference types="Cypress" />

import { visit } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { config } from "../../../../src/test/testEnvConfig";
import { constants } from "../../common/constants";

const utils = new Utilities(config);

context("Selection", () => {
  beforeEach(() => {
    visit();
  });

  it("Select many one cell ranges with ctrl or meta key", () => { // ✅
    utils.selectCell(500, 100);

    const ctrlKey = !utils.isMacOs() && true;
    utils.selectCell(500, 200, { metaKey: true, ctrlKey });
    utils.selectCell(200, 140, { metaKey: true, ctrlKey });
    utils.selectCell(600, 350, { metaKey: true, ctrlKey });
    utils.getPartialArea().should("be.visible").and("have.length", 3);
    utils.getCellFocus().should("be.visible").and("have.length", 1);
  });

  it("Select one range, selection range should be changed, shift key pressed", () => { // ✅
    const cellStartX = 2;
    const cellStartY = 3;

    utils.selectCell(
      config.cellWidth * cellStartX + utils.getCellXCenter(),
      config.cellHeight * cellStartY + utils.getCellYCenter()
    );
    utils.getPartialArea().should("not.exist");

    let expandForCellX = 2;
    let expandForCellY = 2;
    utils.selectCell(
      config.cellWidth * (cellStartX + expandForCellX) + utils.getCellXCenter(),
      config.cellHeight * (cellStartY + expandForCellY) +
        utils.getCellYCenter(),
      { shiftKey: true }
    );
    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementWidthIsEqual(
      utils.getPartialArea().eq(0),
      config.cellWidth * (expandForCellX + 1) + config.lineWidth
    );
    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * (expandForCellY + 1) + config.lineWidth
    );

    expandForCellX = 0;
    expandForCellY = 4;
    utils.selectCell(
      config.cellWidth * (cellStartX + expandForCellX) + utils.getCellXCenter(),
      config.cellHeight * (cellStartY + expandForCellY) +
        utils.getCellYCenter(),
      { shiftKey: true }
    );
    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementWidthIsEqual(
      utils.getPartialArea().eq(0),
      config.cellWidth * (expandForCellX + 1) + config.lineWidth
    );
    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * (expandForCellY + 1) + config.lineWidth
    );

    expandForCellX = 1;
    expandForCellY = 8;
    utils.selectCell(
      config.cellWidth * (cellStartX + expandForCellX) + utils.getCellXCenter(),
      config.cellHeight * (cellStartY + expandForCellY) +
        utils.getCellYCenter(),
      { shiftKey: true }
    );
    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementWidthIsEqual(
      utils.getPartialArea().eq(0),
      config.cellWidth * (expandForCellX + 1) + config.lineWidth
    );
    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * (expandForCellY + 1) + config.lineWidth
    );
  });

  it("Shift key pressed + arrow up should resize selection range up", () => { // ✅
    const cellToSelect = 3;

    utils.selectCell(config.cellWidth * 3, config.cellHeight * 10);
    for (let i = 0; i < cellToSelect; i++)
      utils.keyDown(constants.keyCodes.ArrowUp, {
        shiftKey: true,
        force: true,
      });
    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * (cellToSelect + 1) + config.lineWidth
    );
    cy.wait(200);
    utils.assertElementWidthIsEqual(
      utils.getPartialArea().eq(0),
      config.cellWidth * 1 + config.lineWidth
    );
  });

  it("Shift key pressed + arrow right should resize selection range right", () => { // ✅
    const cellToSelect = 2;

    utils.selectCell(config.cellWidth * 3, config.cellHeight * 10);
    for (let i = 0; i < cellToSelect; i++)
      utils.keyDown(constants.keyCodes.ArrowRight, {
        shiftKey: true,
        force: true,
      });
    cy.wait(200);
    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * 1 + config.lineWidth
    );
    utils.assertElementWidthIsEqual(
      utils.getPartialArea().eq(0),
      config.cellWidth * (cellToSelect + 1) + config.lineWidth
    );
  });

  it("Shift key pressed + arrow left should resize selection range left", () => { // ✅
    const cellToSelect = 4;

    utils.selectCell(config.cellWidth * 5, config.cellHeight * 10);
    for (let i = 0; i < cellToSelect; i++)
      utils.keyDown(constants.keyCodes.ArrowLeft, {
        shiftKey: true,
        force: true,
      });
    cy.wait(200);
    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * 1 + config.lineWidth
    );
    utils.assertElementWidthIsEqual(
      utils.getPartialArea().eq(0),
      config.cellWidth * (cellToSelect + 1)
    ); // no line width
  });

  it("Shift key pressed + arrow down should resize selection range down", () => { // ✅
    const cellToSelect = 5;

    utils.selectCell(config.cellWidth * 3, config.cellHeight * 10);
    for (let i = 0; i < cellToSelect; i++)
      utils.keyDown(constants.keyCodes.ArrowDown, {
        shiftKey: true,
        force: true,
      });
    cy.wait(200);
    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * (cellToSelect + 1) + config.lineWidth
    );
    utils.assertElementWidthIsEqual(
      utils.getPartialArea().eq(0),
      config.cellWidth * 1 + config.lineWidth
    );
  });

  it("Ctrl or meta + A should select whole grid", () => { // ✅
    utils.scrollTo(
      config.cellWidth * config.columns,
      config.cellHeight * config.rows
    );
    cy.wait(200);
    utils.selectCell(
      config.rgViewportWidth - utils.getCellXCenter(),
      config.rgViewportHeight - config.cellHeight - 1
    ); // 'config.cellHeight - 1' for Firefox
    utils.keyDown(constants.keyCodes.A, {
      metaKey: true,
      ctrlKey: !utils.isMacOs() && true,
      force: true,
    });

    utils.getPartialArea().should("to.be.visible");

    utils.scrollTo(0, 0);
    cy.wait(500);

    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);
    utils.assertElementLeftIsEqual(utils.getPartialArea(), 0);
  });

  it("Shift + end should select row at begging of cell focus", () => { // ✅
    utils.selectCell(
      config.cellWidth + utils.getCellXCenter(),
      config.cellHeight * 4 + utils.getCellYCenter()
    );
    utils.keyDown(constants.keyCodes.End, { shiftKey: true, force: true });

    utils.assertElementLeftIsEqual(
      utils.getPartialArea(),
      config.cellWidth - config.lineWidth
    );

    utils.scrollToRight();

    cy.wait(500);
    utils.assertElementRightIsEqual(utils.getPartialArea(), 0);
  });

  it("Shift + PageUp should select area above focus location", () => { // ✅
    utils.selectCell(
      config.cellWidth * 2 - utils.getCellXCenter(),
      config.cellHeight * 4 + utils.getCellYCenter()
    );
    utils.keyDown(constants.keyCodes.PageUp, {
      shiftKey: true,
      force: true,
    });

    cy.wait(200);
    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);
  });

  it("Shift + PageDown should select rows below focus", () => { // ✅
    utils.selectCell(
      config.cellWidth * 2 - utils.getCellXCenter(),
      config.cellHeight * 4 + utils.getCellYCenter()
    );
    utils.keyDown(constants.keyCodes.PageDown, {
      shiftKey: true,
      force: true,
    });

    cy.wait(200);
    utils.assertElementHeightIsEqual(
      utils.getPartialArea(),
      config.rgViewportHeight + config.lineWidth
    );
  });

  it("Shift + home should select row to end of cell focus", () => { // ✅
    utils.scrollToRight();

    utils.selectCell(
      config.rgViewportWidth - config.cellWidth - utils.getCellXCenter(),
      config.cellHeight * 4 + utils.getCellYCenter()
    );
    utils.keyDown(constants.keyCodes.Home, { shiftKey: true, force: true });

    utils.assertElementRightIsEqual(utils.getPartialArea(), config.cellWidth);

    utils.scrollTo(0, 0);
    cy.wait(200);

    utils.assertElementLeftIsEqual(utils.getPartialArea(), 0);
  });

  it("CTRL or META + home should select cell in first row and column", () => { // ✅
    utils.selectCell(
      config.rgViewportWidth - config.cellWidth - utils.getCellXCenter(),
      config.cellHeight * 4 + utils.getCellYCenter()
    );
    utils.keyDown(constants.keyCodes.End, {
      metaKey: true,
      ctrlKey: !utils.isMacOs() && true,
      force: true,
    });

    cy.wait(200);
    utils.assertElementLeftIsEqual(
      utils.getCellFocus(),
      config.cellWidth * (config.columns - 1) - config.lineWidth
    );
    utils.assertElementTopIsEqual(
      utils.getCellFocus(),
      config.cellHeight * (config.rows - 1) - config.lineWidth
    );
  });

  it("SHIFT + SPACE should select single row", () => { // ✅
    utils.selectCell(
      config.cellWidth * 3 - utils.getCellXCenter(),
      config.cellHeight * 4 + utils.getCellYCenter()
    );
    utils.keyDown(constants.keyCodes.Space, { shiftKey: true, force: true });
    cy.wait(200);
    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementLeftIsEqual(utils.getPartialArea(), 0);
    utils.assertElementHeightIsEqual(
      utils.getPartialArea(),
      config.cellHeight + config.lineWidth
    );
  });

  it("CTRL + SPACE should select single column", () => { // ✅
    utils.selectCell(
      config.cellWidth * 3 - utils.getCellXCenter(),
      config.cellHeight * 4 + utils.getCellYCenter()
    );
    utils.keyDown(constants.keyCodes.Space, { ctrlKey: true, force: true });
    cy.wait(200);
    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);
    utils.assertElementWidthIsEqual(
      utils.getPartialArea(),
      config.cellWidth + config.lineWidth
    );
  });
});
