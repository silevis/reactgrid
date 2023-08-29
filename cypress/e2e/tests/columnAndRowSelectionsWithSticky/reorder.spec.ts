import { visitColumnAndRowSelectionsWithSticky } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { config } from "../../../../src/test/testEnvConfig";

const utils = new Utilities(config);

context("Reorder", () => {
  beforeEach(() => {
    visitColumnAndRowSelectionsWithSticky();
  });

  it("Should reorder left sticky column to scrollable area", () => {
    // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.cellWidth * 2;

    utils.selectCell(cellHorizontalMiddle, cellVerticalMiddle);
    const selectedCellsContent = [`0 - 0`];
    utils.reorderColumn(cellHorizontalMiddle, cellVerticalMiddle, moveDistance);

    utils.assertElementLeftIsEqual(utils.getPartialArea(), 0);

    utils
      .getCell(2, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
  });

  it("Should reorder column into left sticky", () => {
    // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = -config.cellWidth * 2;

    utils.selectCell(
      cellHorizontalMiddle + config.cellWidth * 2,
      cellVerticalMiddle
    );
    const selectedCellsContent = [`0 - ${2}`];
    utils.reorderColumn(
      cellHorizontalMiddle + config.cellWidth * 2,
      cellVerticalMiddle,
      moveDistance
    );

    utils.assertElementLeftIsEqual(utils.getPartialArea(), 0);
    utils
      .getCell(0, 0)
      .should(($cell) => expect($cell.eq(0)).to.contain(selectedCellsContent));
  });

  it("Should select more columns and reorder to right", () => {
    // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.cellWidth * 4;

    utils.selectRange(
      cellHorizontalMiddle,
      cellVerticalMiddle,
      cellHorizontalMiddle + config.cellWidth,
      cellVerticalMiddle
    );
    const selectedCellsContent = [`0 - ${0}`, `0 - ${1}`];
    utils.reorderColumn(
      config.cellWidth + cellHorizontalMiddle,
      cellVerticalMiddle,
      moveDistance
    );

    utils.assertElementLeftIsEqual(
      utils.getPartialArea(),
      config.cellWidth * (4 - 2) - config.lineWidth
    );
    utils
      .getCell(4, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(5, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
  });

  it("Should select more columns and reorder to left", () => {
    // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = -config.cellWidth * 2;

    utils.selectRange(
      cellHorizontalMiddle + config.cellWidth * 2,
      cellVerticalMiddle,
      cellHorizontalMiddle + config.cellWidth * 4,
      cellVerticalMiddle
    );
    const selectedCellsContent = [`0 - ${2}`, `0 - ${3}`, `0 - ${4}`];
    utils.reorderColumn(
      cellHorizontalMiddle + config.cellWidth * 2,
      cellVerticalMiddle,
      moveDistance
    );

    utils.assertElementLeftIsEqual(utils.getPartialArea(), 0);
    utils
      .getCell(0, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(1, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
    utils
      .getCell(2, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[2])
      );
  });

  it("Should select more columns and reorder to end", () => {
    // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance =
      config.columns * config.cellWidth + cellHorizontalMiddle + 10;

    utils.selectRange(
      cellHorizontalMiddle,
      cellVerticalMiddle,
      cellHorizontalMiddle + config.cellWidth,
      cellVerticalMiddle
    );
    const selectedCellsContent = [`0 - ${0}`, `0 - ${1}`];
    utils.reorderColumn(
      config.cellWidth + cellHorizontalMiddle,
      cellVerticalMiddle,
      moveDistance,
      25
    );

    utils.assertElementLeftIsEqual(utils.getPartialArea(), 0);
    utils
      .getCell(config.columns - 2, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(config.columns - 1, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
  });

  it("Should select right sticky and reorder to start", () => {
    // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance =
      -(config.columns * config.cellWidth) + cellHorizontalMiddle;

    utils.scrollToRight();
    utils.moveCursorHorizontallyOnScrollable(
      config.rgViewportWidth - cellHorizontalMiddle,
      cellVerticalMiddle,
      -(config.cellWidth * (config.stickyRight - 1))
    );
    const selectedCellsContent = [
      `0 - ${config.columns - 2}`,
      `0 - ${config.columns - 1}`,
    ];

    utils.reorderColumn(
      config.rgViewportWidth - utils.getCellXCenter(),
      cellVerticalMiddle,
      moveDistance,
      25
    );

    utils.assertElementLeftIsEqual(utils.getPartialArea(), 0);
    utils
      .getCell(0, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(1, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
  });
});
