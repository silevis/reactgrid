/// <reference types="Cypress" />

import { visit } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { config } from "../../../../src/test/testEnvConfig";

const utils = new Utilities(config);

context("Fill handle", () => {
  beforeEach(() => {
    visit();
  });

  it("Fill handle should replicate cell in group A", () => {
    // ✅
    const cellRowIdx = 0;
    const cellColIdx = 6;
    utils
      .getCell(cellRowIdx, cellColIdx)
      .invoke("text")
      .then(($originCellText) => {
        const startCellX = config.cellWidth * (cellRowIdx + 1);
        const endCellY = config.cellHeight * (cellColIdx + 1);

        utils.selectCell(startCellX, endCellY);
        utils.fillCells(startCellX, endCellY - (config.cellHeight * 3));
        utils
          .getCell(cellRowIdx, cellColIdx - 3)
          .should(($cell) => expect($cell.eq(0)).to.contain($originCellText));
      });
  });

  it("Fill handle should replicate cell in group B", () => {
    // ✅
    const cellRowIdx = 1;
    const cellColIdx = 6;
    utils
      .getCell(cellRowIdx, cellColIdx)
      .invoke("text")
      .then(($originCellText) => {
        const startCellX = config.cellWidth * (cellRowIdx + 1);
        const endCellY = config.cellHeight * (cellColIdx + 1);

        utils.selectCell(startCellX, endCellY);

        utils.fillCells(startCellX, endCellY - (config.cellHeight * 3));
        utils
          .getCell(cellRowIdx, cellColIdx - 3)
          .should(($cell) => expect($cell.eq(0)).to.contain($originCellText));
      });
  });

  it("Fill handle should replicate cell in undefined group", () => {
    // ✅
    const cellRowIdx = 1;
    const cellColIdx = 5;
    utils
      .getCell(cellRowIdx, cellColIdx)
      .invoke("text")
      .then(($originCellText) => {
        const startCellX = config.cellWidth * (cellRowIdx + 1);
        const endCellY = config.cellHeight * (cellColIdx + 1);

        utils.selectCell(startCellX, endCellY);

        utils.fillCells(startCellX, endCellY - config.cellHeight * 4);
        utils
          .getCell(cellRowIdx, cellColIdx - 1)
          .should(($cell) => expect($cell.eq(0)).to.contain($originCellText));
        utils
          .getCell(cellRowIdx, cellColIdx - 4)
          .should(($cell) => expect($cell.eq(0)).to.contain($originCellText));
      });
  });

  it("Fill handle by range should duplicate first selection row to first row (by applying pattern) above selection with modifier key pressed", () => {
    // ✅
    const startColIdx = 1;
    const endColIdx = 3;
    const startRowIdx = 2;
    const endRowIdx = 4;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);
    for (let colId = startColIdx; colId < endColIdx + 1; colId++) {
      utils.getCell(colId, endRowIdx).as(`cell_col_${colId}`);
    }
    const colsCount = endColIdx - startColIdx + 1;
    const rowsCount = endRowIdx - startRowIdx + 1;
    utils.fillCells(endX, endY - config.cellHeight * rowsCount, true, {
      altKey: utils.isMacOs(),
      ctrlKey: !utils.isMacOs() && true,
      force: true,
    });
    for (let i = 0; i < colsCount; i++) {
      utils
        .getCell(startColIdx + i, endRowIdx - rowsCount)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_col_${startColIdx + i}`).then(($a) =>
            expect($a.text()).to.be.equal(checkedCellText)
          );
        });
    }
  });

  it("Fill handle by range should duplicate last selection row to last selection row above with modifier key pressed", () => {
    // ✅
    const startColIdx = 1;
    const endColIdx = 3;
    const startRowIdx = 7;
    const endRowIdx = 5;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);
    for (let colId = startColIdx; colId < endColIdx + 1; colId++) {
      utils.getCell(colId, endRowIdx + 3).as(`cell_col_${colId}`);
    }
    const colsCount = endColIdx - startColIdx + 1;

    utils.fillCells(endX, endY + -config.cellHeight * 2, true, {
      altKey: utils.isMacOs(),
      ctrlKey: !utils.isMacOs() && true,
      force: true,
    });
    for (let i = 0; i < colsCount; i++) {
      utils
        .getCell(startColIdx + i, endRowIdx + 3)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_col_${startColIdx + i}`).then(($a) =>
            expect($a.text()).to.be.equal(checkedCellText)
          );
        });
    }
  });

  it("Fill handle by range should duplicate first selection row to first row below selection with ctrlKey", () => {
    // ✅
    const startColIdx = 1;
    const endColIdx = 3;
    const startRowIdx = 2;
    const endRowIdx = 4;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);
    for (let colId = startColIdx; colId < endColIdx + 1; colId++) {
      utils.getCell(colId, endRowIdx + 1).as(`cell_col_${colId}`);
    }
    const colsCount = endColIdx - startColIdx + 1;

    utils.fillCells(endX, endY + config.cellHeight * 2, true, {
      altKey: utils.isMacOs(),
      ctrlKey: !utils.isMacOs() && true,
      force: true,
    });
    for (let i = 0; i < colsCount; i++) {
      utils
        .getCell(startColIdx + i, endRowIdx + 1)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_col_${startColIdx + i}`).then(($a) =>
            expect($a.text()).to.be.equal(checkedCellText)
          );
        });
    }
  });

  it("Fill handle by range should duplicate last selection row to last selection below with ctrlKey", () => {
    // ✅
    const startColIdx = 1;
    const endColIdx = 3;
    const startRowIdx = 2;
    const endRowIdx = 4;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);
    for (let colId = startColIdx; colId < endColIdx + 1; colId++) {
      utils.getCell(colId, endRowIdx + 3).as(`cell_col_${colId}`);
    }
    const colsCount = endColIdx - startColIdx + 1;

    utils.fillCells(endX, endY + config.cellHeight * 4, true, {
      altKey: utils.isMacOs(),
      ctrlKey: !utils.isMacOs() && true,
      force: true,
    });
    for (let i = 0; i < colsCount; i++) {
      utils
        .getCell(startColIdx + i, endRowIdx + 3)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_col_${startColIdx + i}`).then(($a) =>
            expect($a.text()).to.be.equal(checkedCellText)
          );
        });
    }
  });

  it("Fill handle by range should duplicate first selection column to one column before selection with ctrl key", () => {
    // ✅
    const startColIdx = 2;
    const endColIdx = 3;
    const startRowIdx = 4;
    const endRowIdx = 5;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);

    for (let rowId = startRowIdx; rowId < endRowIdx + 1; rowId++) {
      utils.getCell(endColIdx, rowId).as(`cell_row_${rowId}`);
    }

    const colsCount = endColIdx - startColIdx + 2;
    const rowsCount = endRowIdx - startRowIdx + 1;

    utils.fillCells(endX - config.cellWidth * colsCount, endY, true, {
      altKey: utils.isMacOs(),
      ctrlKey: !utils.isMacOs() && true,
      force: true,
    });

    for (let i = 0; i < rowsCount; i++) {
      utils
        .getCell(startColIdx - 1, startRowIdx + i)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_row_${startRowIdx + i}`).then(($a) =>
            expect($a.text()).to.be.equal(checkedCellText)
          );
        });
    }
  });

  it("Fill handle by range should duplicate last selection column to one column before selection with ctrl key", () => {
    // ✅
    const startColIdx = 3;
    const endColIdx = 3;
    const startRowIdx = 3;
    const endRowIdx = 6;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);

    for (let rowId = startRowIdx; rowId < endRowIdx + 1; rowId++) {
      utils.getCell(endColIdx, rowId).as(`cell_row_${rowId}`);
    }

    const colsCount = endColIdx - startColIdx + 1;
    const rowsCount = endRowIdx - startRowIdx + 1;

    utils.fillCells(endX - config.cellWidth * colsCount, endY);

    for (let i = 0; i < rowsCount; i++) {
      utils
        .getCell(startColIdx - 1, startRowIdx + i)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_row_${startRowIdx + i}`).then(($a) =>
            expect($a.text()).to.be.equal(checkedCellText)
          );
        });
    }
  });

  it("Fill handle by range should duplicate first selection column to one column after selection with ctrl key", () => {
    // ✅
    const startColIdx = 0;
    const endColIdx = 1;
    const startRowIdx = 4;
    const endRowIdx = 5;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);

    for (let rowId = startRowIdx; rowId < endRowIdx + 1; rowId++) {
      utils.getCell(endColIdx, rowId).as(`cell_row_${rowId}`);
    }

    const colsCount = endColIdx - startColIdx;
    const rowsCount = endRowIdx - startRowIdx + 1;

    utils.fillCells(endX + config.cellWidth * 2, endY, true, {
      altKey: utils.isMacOs(),
      ctrlKey: !utils.isMacOs() && true,
      force: true,
    });
    for (let i = 0; i < rowsCount; i++) {
      utils
        .getCell(startColIdx + colsCount, startRowIdx + i)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_row_${startRowIdx + i}`).then(($a) =>
            expect($a.text()).to.be.equal(checkedCellText)
          );
        });
    }
  });

  it("Fill handle by range should duplicate last selection column to one column after selection with ctrl key", () => {
    // ✅
    const startColIdx = 1;
    const endColIdx = 1;
    const startRowIdx = 4;
    const endRowIdx = 5;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);

    for (let rowId = startRowIdx; rowId < endRowIdx + 1; rowId++) {
      utils.getCell(endColIdx, rowId).as(`cell_row_${rowId}`);
    }

    const colsCount = endColIdx - startColIdx + 1;
    const rowsCount = endRowIdx - startRowIdx + 1;

    utils.fillCells(endX + config.cellWidth, endY);
    for (let i = 0; i < rowsCount; i++) {
      utils
        .getCell(startColIdx + colsCount, startRowIdx + i)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_row_${startRowIdx + i}`).then(($a) =>
            expect($a.text()).to.be.equal(checkedCellText)
          );
        });
    }
  });

  it("should NOT copy values beetween incopatible groupId cells - from group to undefined", () => {
    // ✅
    const startColIdx = 0;
    const endColIdx = 1;
    const startRowIdx = 3;
    const endRowIdx = 3;

    const startX = utils.getCellCenterX(startColIdx);
    const endX = utils.getCellCenterX(endColIdx);
    const startY = utils.getCellCenterY(startRowIdx);
    const endY = utils.getCellCenterY(endRowIdx);

    utils.selectRange(startX, startY, endX, endY);
    for (let colId = startColIdx; colId < endColIdx + 1; colId++) {
      utils.getCell(colId, endRowIdx).as(`cell_col_${colId}`);
    }
    const colsCount = endColIdx - startColIdx + 1;
    const rowsCount = endRowIdx - startRowIdx + 1;
    utils.fillCells(endX, endY - config.cellHeight * (rowsCount - 1));
    for (let i = 0; i < colsCount; i++) {
      utils
        .getCell(startColIdx + i, endRowIdx - rowsCount)
        .invoke("text")
        .then((checkedCellText) => {
          cy.get(`@cell_col_${startColIdx + i}`).then(($a) =>
            expect($a.text()).to.not.be.equal(checkedCellText)
          );
        });
    }
  });

  it("should NOT copy values beetween incopatible groupId cells - from group to other group", () => {
    // ✅
    const colIdx = 0;
    const rowIdx = 3;

    const endX = utils.getCellCenterX(colIdx);
    const endY = utils.getCellCenterY(rowIdx);

    utils.selectCell(endX, endY);

    utils.getCell(colIdx, rowIdx).as(`cell_col_${colIdx}`);

    utils.fillCells(
      endX + config.cellWidth,
      config.cellHeight * (rowIdx + 2),
      true
    );
    utils
      .getCell(colIdx + 1, rowIdx)
      .invoke("text")
      .then((checkedCellText) => {
        cy.get(`@cell_col_${colIdx}`).then(($a) =>
          expect($a.text()).to.not.be.contain(checkedCellText)
        );
      });
  });
});
