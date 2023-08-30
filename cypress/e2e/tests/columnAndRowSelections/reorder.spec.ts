/// <reference types="Cypress" />

import { visitColumnAndRowSelections } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { config } from "../../../../src/test/testEnvConfig";

const utils = new Utilities(config);

context("Reorder", () => {
  beforeEach(() => {
    visitColumnAndRowSelections();
  });

  it("Should reorder column to right", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.cellWidth * 2;

    utils.selectCell(cellHorizontalMiddle, cellVerticalMiddle);
    const selectedCellsContent = [`0 - 0`];
    utils.reorderColumn(cellHorizontalMiddle, cellVerticalMiddle, moveDistance);

    utils.assertElementLeftIsEqual(
      utils.getPartialArea(),
      config.cellWidth * 2 - config.lineWidth
    );

    utils
      .getCell(2, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
  });

  it("Should reorder column to left", () => { // ✅
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

  it("Should select more columns and reorder to right", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.cellWidth * 2;

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
      config.cellWidth * 2 - config.lineWidth
    );
    utils
      .getCell(2, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(3, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
  });

  it("Should select more columns and reorder to left", () => { // ✅
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

  it("Should select more columns and reorder to end", () => { // ✅
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
      45
    );
    utils.scrollToRight();
    // Utils.assertElementLeftIsEqual(utils.getPartialArea(), config.columns * config.cellWidth - config.cellWidth * 2 - config.lineWidth);
    // Utils.getCell(config.columns - 2, 0).should(($cell) => expect($cell.eq(0)).to.contain(selectedCellsContent[0]));
    // Utils.getCell(config.columns - 1, 0).should(($cell) => expect($cell.eq(0)).to.contain(selectedCellsContent[1]));
  });

  it("Should select more columns and reorder to start", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance =
      -(config.columns * config.cellWidth) + cellHorizontalMiddle;

    utils.scrollToRight();
    utils.selectRange(
      config.rgViewportWidth - config.cellWidth - cellHorizontalMiddle,
      cellVerticalMiddle,
      config.rgViewportWidth - cellHorizontalMiddle,
      cellVerticalMiddle
    );
    const selectedCellsContent = [
      `0 - ${config.columns - 2}`,
      `0 - ${config.columns - 1}`,
    ];
    utils.reorderColumn(
      config.rgViewportWidth - cellHorizontalMiddle,
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

  it("Should reorder one row below", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.cellHeight * 2;

    utils.selectCell(
      cellHorizontalMiddle,
      cellVerticalMiddle + config.cellHeight
    );
    const selectedCellsContent = [`${1} - 0`];
    utils.reorderRow(
      cellHorizontalMiddle,
      cellVerticalMiddle + config.cellHeight,
      moveDistance
    );

    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight * 3 - config.lineWidth
    );
    utils
      .getCell(0, 3)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
  });

  it("Should reorder one row to top", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = -config.cellHeight;

    utils.selectCell(
      cellHorizontalMiddle,
      config.cellHeight * 2 + cellVerticalMiddle
    );
    const selectedCellsContent = [`${2} - 0`];
    utils.reorderRow(
      cellHorizontalMiddle,
      config.cellHeight * 2 + cellVerticalMiddle,
      moveDistance
    );

    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight - config.lineWidth
    );
    utils
      .getCell(0, 1)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
  });

  it("Should select more rows and reorder to bottom", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.cellHeight * 5;

    utils.selectRange(
      cellHorizontalMiddle,
      cellVerticalMiddle + config.cellHeight,
      cellHorizontalMiddle,
      config.cellHeight * 3 + cellVerticalMiddle
    );
    const selectedCellsContent = [`${1} - 0`, `${2} - 0`, `${3} - 0`];
    utils.reorderRow(cellHorizontalMiddle, config.cellHeight * 2, moveDistance);

    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight * 4 - config.lineWidth
    );
    utils
      .getCell(0, 4)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(0, 5)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
    utils
      .getCell(0, 6)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[2])
      );
  });

  it("Should select more rows and reorder to top", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = -config.cellHeight * 3 - cellVerticalMiddle;

    utils.selectRange(
      cellHorizontalMiddle,
      config.cellHeight * 4 + cellVerticalMiddle,
      cellHorizontalMiddle,
      config.cellHeight * 6 + cellVerticalMiddle
    );
    const selectedCellsContent = [`${4} - 0`, `${5} - 0`, `${6} - 0`];
    utils.reorderRow(
      cellHorizontalMiddle,
      config.cellHeight * 5 - cellVerticalMiddle,
      moveDistance
    );

    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.cellHeight - config.lineWidth
    );
    utils
      .getCell(0, 1)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(0, 2)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
    utils
      .getCell(0, 3)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[2])
      );
  });

  it("Should select 3 rows and reorder to end", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.rows * config.cellHeight + cellVerticalMiddle;

    utils.selectRange(
      cellHorizontalMiddle,
      config.cellHeight * 4 + cellVerticalMiddle,
      cellHorizontalMiddle,
      config.cellHeight * 6 + cellVerticalMiddle
    );
    const selectedCellsContent = [`${4} - 0`, `${5} - 0`, `${6} - 0`];
    utils.reorderRow(
      cellHorizontalMiddle,
      config.cellHeight * 4 + cellVerticalMiddle,
      moveDistance,
      15
    );

    utils.assertElementTopIsEqual(
      utils.getPartialArea(),
      config.rows * config.cellHeight - config.cellHeight * 3 - config.lineWidth
    );
    utils
      .getCell(0, config.rows - 3)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(0, config.rows - 2)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
    utils
      .getCell(0, config.rows - 1)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[2])
      );
  });

  it("Should select 3 rows and reorder to start", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = -(config.rows * config.cellHeight);

    utils.scrollToBottom();
    cy.wait(1000);
    utils.selectRange(
      cellHorizontalMiddle,
      config.rgViewportHeight - config.cellHeight * 2 - cellVerticalMiddle,
      cellHorizontalMiddle,
      config.rgViewportHeight - cellVerticalMiddle - 10
    );
    const selectedCellsContent = [
      `${config.rows - 3} - 0`,
      `${config.rows - 2} - 0`,
      `${config.rows - 1} - 0`,
    ];
    utils.reorderRow(
      cellHorizontalMiddle,
      config.rgViewportHeight - cellVerticalMiddle - 10,
      moveDistance,
      45
    );

    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);
    utils
      .getCell(0, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
    utils
      .getCell(0, 1)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[1])
      );
    utils
      .getCell(0, 2)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[2])
      );
  });

  it("Should display shadow on reordering by touch", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.cellWidth * 2;

    utils.selectCell(cellHorizontalMiddle, cellVerticalMiddle);
    const selectedCellsContent = [`0 - 0`];

    const endingPoint = cellHorizontalMiddle + moveDistance;
    const scrollableElement = utils.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      const body = utils.getBody();
      scrollableElement.trigger(
        "pointerdown",
        cellHorizontalMiddle + offsetLeft,
        cellVerticalMiddle + offsetTop,
        { log: false, pointerType: "touch" }
      );
      for (
        let x = cellHorizontalMiddle;
        moveDistance < 0 ? x > endingPoint : x < endingPoint;
        x += moveDistance > 0 ? 5 : -5
      ) {
        body
          .wait(10, { log: false })
          .trigger("pointermove", x, cellVerticalMiddle + (x % 2), { log: false, force: true, pointerType: "touch" });
      }

      utils.getReorderShadow().should("be.visible");

      body.wait(10).trigger("pointerup", {
        clientX: endingPoint,
        clientY: cellVerticalMiddle,
        force: true,
        log: false,
        pointerType: "touch",
      });
    });

    cy.wait(200);

    utils.assertElementLeftIsEqual(
      utils.getPartialArea(),
      config.cellWidth * 2 - config.lineWidth
    );

    utils
      .getCell(2, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
  });

  it("Should hide shadow after reordering by touch", () => { // ✅
    const cellVerticalMiddle = utils.getCellYCenter();
    const cellHorizontalMiddle = utils.getCellXCenter();
    const moveDistance = config.cellWidth * 2;

    utils.selectCell(cellHorizontalMiddle, cellVerticalMiddle);
    const selectedCellsContent = [`0 - 0`];

    const endingPoint = cellHorizontalMiddle + moveDistance;
    const scrollableElement = utils.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      const body = utils.getBody();
      scrollableElement.trigger(
        "pointerdown",
        cellHorizontalMiddle + offsetLeft,
        cellVerticalMiddle + offsetTop,
        { log: false, pointerType: "touch" }
      );
      for (
        let x = cellHorizontalMiddle;
        moveDistance < 0 ? x > endingPoint : x < endingPoint;
        x += moveDistance > 0 ? 5 : -5
      ) {
        body
          .wait(10, { log: false })
          .trigger("pointermove", x, cellVerticalMiddle + (x % 2), { log: false, force: true, pointerType: "touch" });
      }
      body.wait(10).trigger("pointerup", {
        clientX: endingPoint,
        clientY: cellVerticalMiddle,
        force: true,
        log: false,
        pointerType: "touch",
      });
    });

    utils.getReorderShadow().should("not.exist");

    utils.assertElementLeftIsEqual(
      utils.getPartialArea(),
      config.cellWidth * 2 - config.lineWidth
    );

    utils
      .getCell(2, 0)
      .should(($cell) =>
        expect($cell.eq(0)).to.contain(selectedCellsContent[0])
      );
  });
});
