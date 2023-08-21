/// <reference types="Cypress" />

import { visitHeaders } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { disabledInitialFocusLocationConfig as config } from "../../../../src/test/testEnvConfig";

const utils = new Utilities(config);

context("Selection", () => {
  beforeEach(() => {
    visitHeaders();
  });

  it("should select column without focus", () => {
    // ✅
    utils.selectCell(
      config.cellWidth * 3 + utils.getCellXCenter(),
      utils.getCellYCenter()
    );

    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementLeftIsEqual(
      utils.getPartialArea(),
      config.cellWidth * 3 - config.lineWidth
    );
  });

  it("should select row without focus", () => {
    // ✅
    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight * 9 + utils.getCellYCenter()
    );

    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight * 9 - config.lineWidth
    );
  });

  it("should select multiple columns without moving focus", () => {
    // ✅
    const columnsToSelect = 3;
    const startIdx = 4;
    const fromX = config.cellWidth * startIdx + utils.getCellXCenter();
    const fromY = utils.getCellYCenter();
    const toX = config.cellWidth * (columnsToSelect + startIdx);
    const toY = utils.getCellYCenter();

    utils.selectRange(fromX, fromY, toX, toY);

    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementWidthIsEqual(
      utils.getPartialArea(),
      config.cellWidth * columnsToSelect + config.lineWidth
    );
    utils.assertElementLeftIsEqual(
      utils.getPartialArea(),
      config.cellWidth * startIdx - config.lineWidth
    );
  });

  it.skip("should select multiple rows without moving focus", () => {
    // ✅
    // TODO 🟠 need fix

    const rowsToSelect = 5;
    const startIdx = 6;
    const fromX = utils.getCellXCenter();
    const fromY = config.cellHeight * startIdx + utils.getCellYCenter();
    const toX = utils.getCellYCenter();
    const toY = config.cellHeight * (rowsToSelect + startIdx);

    utils.selectRange(fromX, fromY, toX, toY);

    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementHeightIsEqual(
      utils.getPartialArea(),
      config.cellHeight * rowsToSelect + config.lineWidth
    );
    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight * rowsToSelect - config.lineWidth
    );
  });
});
