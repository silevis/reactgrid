/// <reference types="Cypress" />

import { visit } from "../../common/visit";
import { Utilities } from "../../common/utils";
import { config } from "../../../../src/test/testEnvConfig";
import { constants } from "../../common/constants";

const utils = new Utilities(config);

context("Keyboard", () => {
  beforeEach(() => {
    visit();
  });

  it("Enter key pressed in range should move focus down and doesnt enter edit mode", () => {
    // ✅
    const cellToSelect = 8;

    const startCellColIdx = 1;
    const endCellColIdx = 2;
    const startCellRowIdx = 4;
    const endCellRowIdx = 7;

    const startCellX = config.cellWidth * (startCellColIdx + 1);
    const endCellX = config.cellWidth * (endCellColIdx + 1);
    const startCellY = config.cellHeight * (startCellRowIdx + 1);
    const endCellY = config.cellHeight * (endCellRowIdx + 1);

    utils.selectRange(startCellX, startCellY, endCellX, endCellY);

    for (let i = 0; i < cellToSelect; i++) {
      utils.keyDown(constants.keyCodes.Enter, {
        shiftKey: true,
        force: true,
      });
      utils.getCellEditor().should("not.exist");
    }

    for (let i = 0; i < cellToSelect; i++) {
      utils.keyDown(constants.keyCodes.Enter);
      utils.getCellEditor().should("not.exist");
    }
  });

  it("Shift + Tab, Tab, Shift + Enter, Enter in multiple selection ranges", () => {
    // ✅
    const cellToSelect = 10;

    const startCellColIdx = 1;
    const endCellColIdx = 1;
    const startCellRowIdx = 3;
    const endCellRowIdx = 5;

    const startCellX = config.cellWidth * (startCellColIdx + 1);
    const endCellX = config.cellWidth * (endCellColIdx + 1);
    const startCellY = config.cellHeight * startCellRowIdx;
    const endCellY = config.cellHeight * endCellRowIdx;

    const startCellX2 = config.cellWidth * (startCellColIdx + 2);
    const endCellX2 = config.cellWidth * (endCellColIdx + 2);
    const startCellY2 = config.cellHeight * (startCellRowIdx + 2);
    const endCellY2 = config.cellHeight * (endCellRowIdx - 1);

    utils.selectRange(startCellX, startCellY, endCellX, endCellY, {
      metaKey: true,
      ctrlKey: !utils.isMacOs() && true,
    });
    utils.selectRange(startCellX2, startCellY2, endCellX2, endCellY2, {
      metaKey: true,
      ctrlKey: !utils.isMacOs() && true,
    });
    utils.selectCell(500, 200, {
      metaKey: true,
      ctrlKey: !utils.isMacOs() && true,
    });

    for (let i = 0; i < cellToSelect / 2 + 1; i++) {
      utils.keyDown(constants.keyCodes.Tab);
      utils.getCellFocus().should("be.visible").and("have.length", 1);
    }
    for (let i = 0; i < cellToSelect / 2 + 1; i++) {
      utils.keyDown(constants.keyCodes.Tab, { shiftKey: true, force: true });
      utils.getCellFocus().should("be.visible").and("have.length", 1);
    }
    for (let i = 0; i < cellToSelect / 2 + 1; i++) {
      utils.keyDown(constants.keyCodes.Enter);
      utils.getCellFocus().should("be.visible").and("have.length", 1);
    }
    for (let i = 0; i < cellToSelect / 2 + 1; i++) {
      utils.keyDown(constants.keyCodes.Enter, {
        shiftKey: true,
        force: true,
      });
      utils.getCellFocus().should("be.visible").and("have.length", 1);
    }
  });
});
