/// <reference types="Cypress" />

import { visitColumnAndRowSelections } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { config } from "../../../../src/test/testEnvConfig";

const utils = new Utilities(config);

context("Selection", () => {
  beforeEach(() => {
    cy.reload(); // Seems to be necessary to avoid random failures
    visitColumnAndRowSelections();
  });

  it("Select one column", () => { // ✅
    utils.selectCell(100, 10);
    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);
    /* THIS LINES ARE COMMENTED DUE TO RENDERING A LOT MORE ROWS INSIDE GRID */
    // Utils.assertElementHeightIsEqual(utils.getPartialArea(), config.rgViewportHeight);
    utils.selectCell(500, 10);

    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);
    // Utils.assertElementHeightIsEqual(utils.getPartialArea(), config.rgViewportHeight);

    utils.selectCell(700, 10);

    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);
    // Utils.assertElementHeightIsEqual(utils.getPartialArea(), config.rgViewportHeight);
  });

  it("Select columns and unselect with ctrl or meta key", () => { // ✅
    utils.selectCell(100, 10);
    utils.selectCell(350, 10, {
      metaKey: true,
      ctrlKey: !utils.isMacOs() && true,
    });

    utils.selectCell(500, 10, {
      metaKey: true,
      ctrlKey: !utils.isMacOs() && true,
    });
    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);
    // Utils.assertElementHeightIsEqual(utils.getPartialArea(), config.rgViewportHeight);
    utils.getPartialArea().should("be.visible").and("have.length", 2);

    utils.selectCell(100, 10, {
      metaKey: true,
      ctrlKey: !utils.isMacOs() && true,
    });

    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementWidthIsEqual(
      utils.getPartialArea(),
      config.cellWidth * 2 + config.lineWidth
    );
  });

  it("Select many columns", () => { // ✅
    const columnsToSelect = 4;
    utils.selectRange(
      utils.getCellXCenter(),
      10,
      config.cellWidth * columnsToSelect,
      10
    );
    utils.assertElementWidthIsEqual(
      utils.getPartialArea(),
      config.cellWidth * columnsToSelect
    );
  });

  it("Select one row without selection meta key or ctrl", () => { // ✅
    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight + utils.getCellYCenter()
    );

    utils.getCellFocus().should("be.visible");
    // Utils.assertElementWidthIsEqual(utils.getPartialArea(), Math.ceil(config.rgViewportWidth / config.cellWidth) * config.cellWidth);
    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight - config.lineWidth
    );

    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight * 4 + utils.getCellYCenter()
    );

    utils.getCellFocus().should("be.visible");
    // Utils.assertElementWidthIsEqual(utils.getPartialArea(), Math.ceil(config.rgViewportWidth / config.cellWidth) * config.cellWidth);
    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight * 4 - config.lineWidth
    );

    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight * 6 + utils.getCellYCenter()
    );

    utils.getCellFocus().should("be.visible");
    // Utils.assertElementWidthIsEqual(utils.getPartialArea(), Math.ceil(config.rgViewportWidth / config.cellWidth) * config.cellWidth);
    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight * 6 - config.lineWidth
    );
  });

  it("Select and unselect rows with ctrl or meta key", () => { // ✅
    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight * 2 + utils.getCellYCenter()
    );
    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight * 3 + utils.getCellYCenter(),
      { metaKey: true, ctrlKey: !utils.isMacOs() && true }
    );
    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight * 8 + utils.getCellYCenter(),
      { metaKey: true, ctrlKey: !utils.isMacOs() && true }
    );

    utils.assertElementTopIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * 2 - config.lineWidth
    );
    utils.assertElementTopIsEqual(
      utils.getPartialArea().eq(1),
      config.cellHeight * 8 - config.lineWidth
    );
    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * 2 + config.lineWidth
    );
    // Utils.assertElementWidthIsEqual(utils.getPartialArea().eq(0), Math.ceil(config.rgViewportWidth / config.cellWidth) * config.cellWidth);
    // Utils.assertElementWidthIsEqual(utils.getPartialArea().eq(1), Math.ceil(config.rgViewportWidth / config.cellWidth) * config.cellWidth);
    utils.getPartialArea().should("be.visible").and("have.length", 2);

    cy.wait(1000);
    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight * 8 + utils.getCellYCenter(),
      { metaKey: true, ctrlKey: !utils.isMacOs() && true }
    );

    utils.getPartialArea().should("be.visible").and("have.length", 1);
  });

  it("Select many rows", () => { // ✅
    utils.selectRange(
      utils.getCellXCenter(),
      utils.getCellYCenter() + config.cellHeight * 3,
      10,
      config.cellHeight * 10 + utils.getCellYCenter()
    );

    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * 8 + config.lineWidth
    );
  });

  it("Select many columns with touch from right to left", () => { // ✅
    const columnsToSelect = 2;
    utils.selectRangeWithTouch(
      config.cellWidth * columnsToSelect,
      utils.getCellYCenter(),
      utils.getCellXCenter(),
      utils.getCellYCenter()
    );

    utils.assertElementWidthIsEqual(utils.getPartialArea(), config.cellWidth * columnsToSelect);
  });

  it("Select many rows with touch", () => { // ✅
    utils.selectRangeWithTouch(
      utils.getCellXCenter(),
      utils.getCellYCenter() + config.cellHeight * 3,
      10,
      config.cellHeight * 10 + utils.getCellYCenter()
    );

    utils.assertElementHeightIsEqual(
      utils.getPartialArea().eq(0),
      config.cellHeight * 8 + config.lineWidth
    );
  });
});
