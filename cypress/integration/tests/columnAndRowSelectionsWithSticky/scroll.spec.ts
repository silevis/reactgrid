import { visitColumnAndRowSelectionsWithSticky } from "../../common/visit";

context("Scroll", () => {
  beforeEach(() => {
    visitColumnAndRowSelectionsWithSticky();
  });

  it.skip("should scroll viewport when cell is not fully visible vertically", () => {
    // Utils.scrollTo(0, Utils.getCellYCenter());
    // Utils.selectCell(config.cellWidth + 5, config.cellHeight * config.stickyTop + 5);
    // Utils.assertIsElementInScrollable(Utils.getCellFocus());
    // Utils.assertElementTopIsEqual(Utils.getCellFocus(), 0);
    // Utils.getReactGridViewport().then($viewport => {
    //     const v = $viewport[0];
    //     Utils.selectCell(config.cellWidth + 5, v.clientHeight - (config.stickyBottom * config.cellHeight) - 5);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     const bothStickySize = (config.stickyBottom + config.stickyTop) * config.cellHeight;
    //     Utils.assertElementTopIsEqual(Utils.getCellFocus(), v.clientHeight - bothStickySize - (v.clientHeight) % config.cellHeight - config.lineWidth);
    // });
  });

  it.skip("should scroll viewport when cell is not fully visible horizontally", () => {
    // Utils.scrollTo(Utils.getCellXCenter(), 0);
    // Utils.selectCell(config.cellWidth * config.stickyLeft + 5, config.cellHeight + 5);
    // Utils.assertIsElementInScrollable(Utils.getCellFocus());
    // Utils.assertElementLeftIsEqual(Utils.getCellFocus(), 0);
    // Utils.getReactGridViewport().then($viewport => {
    //     const v = $viewport[0];
    //     Utils.selectCell(v.clientWidth - (config.stickyRight * config.cellWidth) - 5, config.cellHeight - 5);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     const bothStickySize = (config.stickyLeft + config.stickyRight) * config.cellWidth;
    //     Utils.assertElementLeftIsEqual(Utils.getCellFocus(), v.clientWidth - bothStickySize - (v.clientWidth) % config.cellWidth - config.lineWidth)
    // });
  });

  it.skip("shouldnt scroll viewport horizontally, when only left stickys are selected", () => {
    // Utils.scrollTo(config.rgViewportWidth, 0);
    // utils.selectRange(Utils.getCellXCenter(), config.cellHeight * 5 + Utils.getCellYCenter(),
    //     Utils.getCellXCenter(), config.cellHeight * 10 + Utils.getCellYCenter(), { force: true });
    // Utils.assertElementWidthIsEqual(utils.getPartialArea().eq(0), config.cellWidth);
    // Utils.getReactGridViewport().then($viewport => {
    //     const v = $viewport[0];
    //     expect(v.scrollLeft).to.be.greaterThan(0); // ???
    // });
    // Utils.selectCell(config.cellWidth * config.stickyLeft + 5, config.cellHeight + 5);
    // Utils.assertIsElementInScrollable(Utils.getCellFocus());
    // Utils.assertElementLeftIsEqual(Utils.getCellFocus(), 0);
    // Utils.getReactGridViewport().then($viewport => {
    //     const v = $viewport[0];
    //     Utils.selectCell(v.clientWidth - (config.stickyRight * config.cellWidth) - 5, config.cellHeight - 5);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     const bothStickySize = (config.stickyLeft + config.stickyRight) * config.cellWidth;
    //     Utils.assertElementLeftIsEqual(Utils.getCellFocus(), v.clientWidth - bothStickySize - (v.clientWidth) % config.cellWidth - config.lineWidth)
    // });
  });

  it.skip("should scroll to bottom on dragging outside grid", () => {
    //     Utils.getReactGridViewport().trigger('pointerdown', config.cellWidth + 10, 10);
    //     Utils.swingCursor(config.cellWidth + 10, config.rgViewportHeight + 60, 'horizontal', 50);
    //     Utils.getReactGridViewport().trigger('pointerup', { force: true });
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollTop + rg.clientHeight).to.be.eq(config.rows * config.cellHeight)
    //     });
  });

  it.skip("should scroll to top on dragging outside grid", () => {
    //     Utils.scrollToBottom();
    //     cy.wait(200);
    //     Utils.getReactGridViewport().trigger('pointerdown', 10, config.rgViewportHeight - 20);
    //     Utils.swingCursor(config.cellWidth + 10, -60, 'horizontal', 50);
    //     Utils.getReactGridViewport().trigger('pointerup', { force: true });
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollTop).to.be.eq(0)
    //     });
  });

  it.skip("should scroll to right on dragging outside grid", () => {
    //     Utils.getReactGridViewport().trigger('pointerdown', 10, (config.cellHeight * 5) + 10);
    //     Utils.swingCursor(config.rgViewportWidth + 200, (config.cellHeight * 5) + 10, 'vertical', 10);
    //     Utils.getReactGridViewport().trigger('pointerup', { force: true });
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollLeft + rg.clientWidth).to.be.eq(config.columns * config.cellWidth)
    //     });
  });

  it.skip("should scroll to left on dragging outside grid", () => {
    //     Utils.scrollToRight();
    //     cy.wait(200);
    //     Utils.getReactGridViewport().trigger('pointerdown', config.rgViewportWidth - 20, (config.cellHeight * 5) + 10);
    //     Utils.swingCursor(-20, (config.cellHeight * 5) + 10, 'vertical', 10);
    //     Utils.getReactGridViewport().trigger('pointerup', { force: true });
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollLeft).to.be.eq(0)
    //     });
  });

  it.skip("should scroll to bottom on arrow down keydown", () => {
    //     Utils.selectCell(config.cellWidth * 2 + 10, 10);
    //     for (let i = 0; i < config.rows; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { force: true }, 10, false);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollTop + rg.clientHeight - 1).to.be.eq(config.rows * config.cellHeight)
    //     });
  });

  it.skip("should scroll to top on arrow up keydown", () => {
    //     Utils.scrollToBottom();
    //     cy.wait(200);
    //     Utils.selectCell(config.cellWidth * 2 + 10, config.rgViewportHeight - 20);
    //     for (let i = 0; i < config.rows; i++) Utils.keyDown(Constants.keyCodes.ArrowUp, { force: true }, 10, false);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollTop).to.be.eq(0)
    //     });
  });

  it.skip("should scroll to right on arrow right keydown", () => {
    //     Utils.selectCell(10, (config.cellHeight * 5) + 10);
    //     for (let i = 0; i < config.columns; i++) Utils.keyDown(Constants.keyCodes.ArrowRight, { force: true }, 10, false);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollLeft + rg.clientWidth).to.be.eq(config.columns * config.cellWidth)
    //     });
  });

  it.skip("should scroll to left on arrow left keydown", () => {
    //     Utils.scrollToRight();
    //     cy.wait(200);
    //     Utils.selectCell(config.rgViewportWidth - 75, (config.cellHeight * 5) + 10);
    //     for (let i = 0; i < config.columns; i++) Utils.keyDown(Constants.keyCodes.ArrowLeft, { force: true }, 10, false);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollLeft).to.be.eq(0);
    //     });
  });

  it.skip("should scroll if range selection changes sizes horizontally <-left to right-> starting from left", () => {
    //     Utils.selectCell(10, (config.cellHeight * 5) + 10);
    //     for (let i = 0; i < config.columns; i++) Utils.keyDown(Constants.keyCodes.ArrowRight, { shiftKey: true, force: true }, 10, false);
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollLeft + rg.clientWidth - 1).to.be.eq(config.columns * config.cellWidth)
    //     });
    //     for (let i = 0; i < config.columns; i++) Utils.keyDown(Constants.keyCodes.ArrowLeft, { shiftKey: true, force: true }, 10, false);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollLeft).to.be.eq(0);
    //     });
  });

  it.skip("should scroll if range selection changes sizes horizontally <-right to left-> starting from right", () => {
    //     Utils.scrollToRight()
    //     Utils.selectCell(config.rgViewportWidth - 75, (config.cellHeight * 5) + 10);
    //     for (let i = 0; i < config.columns; i++) Utils.keyDown(Constants.keyCodes.ArrowLeft, { shiftKey: true, force: true }, 10, false);
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollLeft).to.be.eq(0);
    //     });
    //     for (let i = 0; i < config.columns; i++) Utils.keyDown(Constants.keyCodes.ArrowRight, { shiftKey: true, force: true }, 10, false);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollLeft + rg.clientWidth - 1).to.be.eq(config.columns * config.cellWidth)
    //     });
  });

  it.skip("should scroll if range selection changes sizes verticaly <-top to bottom-> starting from top", () => {
    //     Utils.selectCell(config.cellWidth + 10, 10);
    //     for (let i = 0; i < config.rows; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { shiftKey: true, force: true }, 10, false);
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollTop + rg.clientHeight - 1).to.be.eq(config.rows * config.cellHeight)
    //     });
    //     for (let i = 0; i < config.rows; i++) Utils.keyDown(Constants.keyCodes.ArrowUp, { shiftKey: true, force: true }, 10, false);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollTop).to.be.eq(0);
    //     });
  });

  it.skip("should scroll if range selection changes sizes horizontally <-bottom to top-> starting from bottom", () => {
    //     Utils.scrollToBottom();
    //     Utils.selectCell(config.cellWidth + 10, config.rgViewportHeight - 20);
    //     for (let i = 0; i < config.rows; i++) Utils.keyDown(Constants.keyCodes.ArrowUp, { shiftKey: true, force: true }, 10, false);
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollTop).to.be.eq(0);
    //     });
    //     for (let i = 0; i < config.rows; i++) Utils.keyDown(Constants.keyCodes.ArrowDown, { shiftKey: true, force: true }, 10, false);
    //     Utils.assertIsElementInScrollable(Utils.getCellFocus());
    //     Utils.getReactGridViewport().then($rg => {
    //         const rg = $rg[0];
    //         expect(rg.scrollTop + rg.clientHeight - 1).to.be.eq(config.rows * config.cellHeight)
    //     });
  });
});
