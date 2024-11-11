import { visitSticky } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { config } from "../../../../src/test/testEnvConfig";

const utils = new Utilities(config);

context("Resize", () => {
  beforeEach(() => {
    visitSticky();
  });

  it("should increase and reduce column width on scrolled view with content in horizontal axis", () => {
    // ✅
    const RESIZE_WIDTH = 100;

    utils.scrollTo(200, 0);
    utils.resizeColumn(
      config.cellWidth - 2,
      utils.getCellYCenter(),
      RESIZE_WIDTH
    );
    cy.wait(200);

    utils.assertElementWidthIsEqual(
      utils.getCell(0, 0),
      config.cellWidth + RESIZE_WIDTH
    );

    utils.resizeColumn(
      config.cellWidth + RESIZE_WIDTH,
      utils.getCellYCenter(),
      -RESIZE_WIDTH
    );
    cy.wait(200);

    utils.assertElementWidthIsEqual(utils.getCell(0, 0), config.cellWidth);
  });

  it("should extend width of many columns", () => {
    // ✅
    const RESIZE_WIDTH = 100;
    utils.resizeColumn(config.cellWidth, utils.getCellYCenter(), RESIZE_WIDTH);
    cy.wait(200);

    utils.resizeColumn(
      config.cellWidth * 2 + RESIZE_WIDTH,
      utils.getCellYCenter(),
      RESIZE_WIDTH
    );
    cy.wait(200);

    utils.resizeColumn(
      config.cellWidth * 3 + RESIZE_WIDTH * 2,
      utils.getCellYCenter(),
      RESIZE_WIDTH
    );
    cy.wait(200);

    utils.assertElementWidthIsEqual(
      utils.getCell(0, 0),
      config.cellWidth + RESIZE_WIDTH
    );
    utils.assertElementWidthIsEqual(
      utils.getCell(0, 1),
      config.cellWidth + RESIZE_WIDTH
    );
    utils.assertElementWidthIsEqual(
      utils.getCell(0, 2),
      config.cellWidth + RESIZE_WIDTH
    );
  });

  it("should reduce many columns", () => {
    // ✅
    const RESIZE_WIDTH = -50;

    utils.resizeColumn(config.cellWidth, utils.getCellYCenter(), RESIZE_WIDTH);
    cy.wait(200);

    utils.resizeColumn(
      config.cellWidth * 2 + RESIZE_WIDTH,
      utils.getCellYCenter(),
      RESIZE_WIDTH
    );
    cy.wait(200);

    utils.resizeColumn(
      config.cellWidth * 3 + RESIZE_WIDTH * 2,
      utils.getCellYCenter(),
      RESIZE_WIDTH
    );
    cy.wait(200);

    utils.assertElementWidthIsEqual(
      utils.getCell(0, 0),
      config.cellWidth + RESIZE_WIDTH
    );
    utils.assertElementWidthIsEqual(
      utils.getCell(0, 1),
      config.cellWidth + RESIZE_WIDTH
    );
    utils.assertElementWidthIsEqual(
      utils.getCell(0, 2),
      config.cellWidth + RESIZE_WIDTH
    );
  });

  it("column should shrink to min width", () => {
    // ✅
    const RESIZE_WIDTH = -config.cellWidth;

    utils.resizeColumn(config.cellWidth, utils.getCellYCenter(), RESIZE_WIDTH);
    cy.wait(200);

    utils.assertElementWidthIsEqual(utils.getCell(0, 0), config.minCellWidth);
  });

  it("column should shrink to its min width in last column", () => {
    // 🔴 fix on macbook pro
    const resizeWidth = -config.cellWidth;

    utils.scrollToRight();
    cy.wait(200);
    utils.selectCell(
      config.rgViewportWidth - utils.getCellXCenter(),
      config.cellHeight * 5 + 10
    );
    utils.resizeColumn(
      config.rgViewportWidth - 17,
      utils.getCellYCenter(),
      resizeWidth
    ); // 17 px - scroll width

    utils.assertElementWidthIsEqual(
      utils.getCell(config.columns - 1, 0),
      config.minCellWidth
    );
  });

  it("column should extend last column", () => {
    // 🔴 fix on macbook pro
    const RESIZE_WIDTH = config.cellWidth;

    utils.scrollToRight();
    cy.wait(200);
    utils.selectCell(
      config.rgViewportWidth - utils.getCellXCenter(),
      config.cellHeight * 5 + 10
    );
    utils.resizeColumn(
      config.rgViewportWidth - 17,
      utils.getCellYCenter(),
      RESIZE_WIDTH
    ); // 17 px - scroll width

    utils.assertElementWidthIsEqual(
      utils.getCell(config.columns - 1, 0),
      config.cellWidth + RESIZE_WIDTH
    );
  });
  
  // rows height
  it("should increase and reduce row height on scrolled view with content in vertical axis", () => {
    // ✅
    const RESIZE_HEIGHT = 40;

    utils.scrollTo(0, 200);
    utils.resizeRow(
      utils.getCellXCenter(),
      config.cellHeight - 2,
      RESIZE_HEIGHT
    );
    cy.wait(200);

    utils.assertElementHeightIsEqual(
      utils.getCell(0, 0),
      config.cellHeight + RESIZE_HEIGHT
    );

    utils.resizeRow(
      utils.getCellXCenter(),
      config.cellHeight + RESIZE_HEIGHT,
      -RESIZE_HEIGHT
    );
    cy.wait(200);

    utils.assertElementHeightIsEqual(utils.getCell(0, 0), config.cellHeight);
  });

});
