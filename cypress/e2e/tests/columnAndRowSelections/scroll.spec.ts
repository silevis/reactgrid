/// <reference types="Cypress" />

import { visitColumnAndRowSelections } from "../../common/visit";
import { constants } from "../../common/constants";
import { config } from "../../../../src/test/testEnvConfig";
import { Utilities } from "../../common/utils";

const utils = new Utilities(config);

context("Scroll", () => {
  beforeEach(() => {
    visitColumnAndRowSelections();
  });

  it("Should keep position while selecting column with touch", () => { // ✅
    utils.selectCell(100, 10, undefined, true);
    utils.getPartialArea().should("be.visible").and("have.length", 1);
    utils.assertElementTopIsEqual(utils.getPartialArea(), 0);

    utils.getScrollableElement().should("have.prop", "scrollLeft", 0);
    utils.getScrollableElement().should("have.prop", "scrollTop", 0);
  });

  it("Should keep position while selecting row with touch", () => { // ✅
    utils.selectCell(
      utils.getCellXCenter(),
      config.cellHeight + utils.getCellYCenter(),
      undefined,
      true
    );

    utils.getCellFocus().should("be.visible");
    utils.assertElementTopIsEqual(utils.getPartialArea(), config.cellHeight - config.lineWidth);

    utils.getScrollableElement().should("have.prop", "scrollLeft", 0);
    utils.getScrollableElement().should("have.prop", "scrollTop", 0);
  });

  it("Should keep position while resizing column with touch", () => { // ✅
    const RESIZE_WIDTH = -(config.cellWidth * 0.5);
    const NEW_WIDTH = config.cellWidth + RESIZE_WIDTH;

    utils.resizeColumn(config.cellWidth, utils.getCellYCenter(), RESIZE_WIDTH, {
      useTouch: true,
      beforePointerUp: () => {
        utils.resizeHint().should("be.visible");
        utils
          .resizeHint()
          .and("contain.text", `Width: ${NEW_WIDTH + 5 /* 5px is the resize handle offset */}px`);
      },
    });

    cy.wait(100);

    utils.assertElementWidthIsEqual(utils.getCell(0, 0), NEW_WIDTH);

    utils.getScrollableElement().should("have.prop", "scrollLeft", 0);
    utils.getScrollableElement().should("have.prop", "scrollTop", 0);
  });

});
