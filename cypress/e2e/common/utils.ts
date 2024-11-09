/// <reference types="cypress" />

import { constants } from "./constants";
import { TestConfig } from "../../../src/test/testEnvConfig";

export interface CellEditorTestParams {
  scroll: {
    x: number;
    y: number;
  };
  click: {
    x: number;
    y: number;
  };
}

interface ResizeParams {
  resizeHandleClickOffset?: number;
  step?: number;
  log?: boolean;
  beforePointerUp: () => void;
  useTouch?: boolean;
}

export class Utilities {
  constructor(private config: TestConfig) {}

  getConfig(): TestConfig {
    return this.config;
  }

  isMacOs(): boolean {
    return Cypress.platform === "darwin";
  }

  selectCell(
    clientX: number,
    clientY: number,
    customEventArgs = undefined,
    useTouch = false
  ): void {
    const scrollableElement = this.getScrollableElement();
    if (customEventArgs !== undefined) {
      scrollableElement.trigger("pointerdown", clientX, clientY, {
        ...customEventArgs,
        pointerType: useTouch ? "touch" : "mouse",
      });
    } else {
      scrollableElement.trigger("pointerdown", clientX, clientY, {
        pointerType: useTouch ? "touch" : "mouse",
      });
    }
    scrollableElement.trigger("pointerup", clientX, clientY, {
      force: true,
      pointerType: useTouch ? "touch" : "mouse",
    });
    cy.wait(500);
  }

  scrollTo(left: number, top: number, duration = 500): void {
    this.getConfig().pinToBody
      ? cy.scrollTo(left, top, { duration, ensureScrollable: true })
      : this.getScrollableElement().scrollTo(left, top, {
          duration,
          ensureScrollable: true,
        });
  }

  wait(): number {
    return this.isMacOs() ? 50 : 100;
  }

  scrollToBottom(left = 0): void {
    const offset = this.getBottomAddtionalOffset(true);
    this.scrollTo(
      left,
      this.getConfig().rows * this.getConfig().cellHeight + offset
    );
  }

  scrollToRight(top = 0): void {
    const offset = this.getRightAddtionalOffset();
    this.scrollTo(
      this.getConfig().columns * this.getConfig().cellWidth + offset,
      top
    );
  }

  getCellXCenter(): number {
    return this.getConfig().cellWidth / 2;
  }

  getCellYCenter(): number {
    return this.getConfig().cellHeight / 2;
  }

  selectCellInEditMode(clientX: number, clientY: number): void {
    this.selectCell(clientX, clientY);
    this.keyDown(constants.keyCodes.Enter, { force: true });
  }

  randomText(): string {
    return Math.random().toString(36).substring(7);
  }

  round(value: number, places = 0): number {
    return +(
      Math.round((value + "e+" + places) as unknown as number) +
      "e-" +
      places
    );
  }

  resetSelection(x: number, y: number): void {
    this.selectCell(x, y + this.getConfig().cellHeight);
    this.selectCell(x, y);
  }

  keyDown(
    keyCode: number,
    customEventArgs?: Record<string, unknown>,
    timeout = 200,
    log = true
  ): void {
    const rg = this.getReactGridContent();
    if (customEventArgs !== undefined) {
      rg.trigger("keydown", { ...customEventArgs, keyCode, log, force: true });
    } else {
      rg.trigger("keydown", { keyCode, log, force: true });
    }
    rg.trigger("keyup", { force: true, log });
    cy.wait(timeout, { log });
  }

  getCell(x: number, y: number): Cypress.Chainable {
    return cy.get(`[data-cell-colidx=${x}][data-cell-rowidx=${y}]`).eq(0);
  }

  getScrollableElement(): Cypress.Chainable {
    // TODO is Body correct element for getting scroll and sroll view?
    return this.config.pinToBody
      ? this.getBody()
      : this.getDivScrollableElement();
  }

  getDivScrollableElement(): Cypress.Chainable {
    return cy.get(".test-grid-container");
  }

  getReactGrid(): Cypress.Chainable {
    return cy.get(".reactgrid");
  }

  getAllCells(): Cypress.Chainable {
    return cy.get(".rg-cell");
  }

  getReactGridContent(): Cypress.Chainable {
    return cy.get(".reactgrid-content");
  }

  getOuterInput(): Cypress.Chainable {
    return cy.get("[data-cy=outer-input]");
  }

  getCellEditor(): Cypress.Chainable {
    return cy.get(".rg-celleditor");
  }

  getBody(): Cypress.Chainable {
    return cy.get("body");
  }

  getLeftStickyPane(): Cypress.Chainable {
    return cy.get(".rg-pane-left");
  }

  getTopStickyPane(): Cypress.Chainable {
    return cy.get(".rg-pane-top");
  }

  getCellFocus(): Cypress.Chainable {
    const cell = cy.get(".rg-cell-focus");
    cell.should("exist");
    return cell;
  }

  getCellHighlight(): Cypress.Chainable {
    return cy.get(".rg-cell-highlight");
  }

  getDropdownMenu(): Cypress.Chainable {
    return cy.get(".rg-dropdown-menu");
  }

  click(x: number, y: number): void {
    // TODO: use pointerdown + pointerup instead of click
    // cypress issue? https://github.com/cypress-io/cypress/issues/21381
    // this.getScrollableElement().trigger("pointerdown", x, y, {
    //   pointerType: "mouse",
    // });
    // cy.wait(100);
    // this.getScrollableElement().trigger("pointerup", x, y, {
    //   pointerType: "mouse",
    // });
    // this.getBody().trigger("pointerup", 0, 0, {
    //   pointerType: "mouse",
    //   force: true,
    // });
    this.getScrollableElement().click(x, y);
  }

  assertElementWidthIsEqual(
    element: Cypress.Chainable,
    expectedWidth: number
  ): void {
    element
      .invoke("css", "width")
      .then((str) => parseInt(str))
      .should("be.eq", expectedWidth);
  }

  assertElementHeightIsEqual(
    element: Cypress.Chainable,
    expectedHeight: number
  ): void {
    element
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.eq", expectedHeight);
  }

  assertElementTopIsEqual(
    element: Cypress.Chainable,
    expectedTop: number
  ): void {
    element
      .invoke("css", "top")
      .then((str) => parseInt(str))
      .should("be.eq", expectedTop);
  }

  assertElementBottomIsEqual(
    element: Cypress.Chainable,
    expectedBottom: number
  ): void {
    element
      .invoke("css", "bottom")
      .then((str) => parseInt(str))
      .should("be.eq", expectedBottom);
  }

  assertElementLeftIsEqual(
    element: Cypress.Chainable,
    expectedLeft: number
  ): void {
    element
      .invoke("css", "left")
      .then((str) => parseInt(str))
      .should("be.eq", expectedLeft);
  }

  assertElementRightIsEqual(
    element: Cypress.Chainable,
    expectedRight: number
  ): void {
    element
      .invoke("css", "right")
      .then((str) => parseInt(str))
      .should("be.eq", expectedRight);
  }

  assertIsElementInScrollable(
    element: Cypress.Chainable<JQuery<HTMLElement>>
  ): void {
    element.then(($el) => {
      const elementRect = $el[0].getBoundingClientRect();
      if (this.config.pinToBody) {
        cy.window()
          .its("scrollY")
          .then(($e) => {
            this.getReactGrid().then(($reactgrid) => {
              const reactgridRect = $reactgrid[0].getBoundingClientRect();
              expect(
                this.round(reactgridRect.y + $el[0].offsetTop + $e)
              ).to.be.least(this.round($e - 1), "top");
              cy.document()
                .its("documentElement")
                .then(($d) => {
                  expect(
                    this.round(
                      $el[0].offsetTop +
                        elementRect.height +
                        reactgridRect.y +
                        $e
                    )
                  ).to.be.most(
                    this.round($e + $d.clientHeight) + 1,
                    "bottom"
                  );
                });
            });
          });
        cy.window()
          .its("scrollX")
          .then(($e) => {
            this.getReactGrid().then(($reactgrid) => {
              const reactgridRect = $reactgrid[0].getBoundingClientRect();
              expect(
                this.round(reactgridRect.x + $el[0].offsetLeft + $e)
              ).to.be.least(this.round($e - 1), "left");
              cy.document()
                .its("documentElement")
                .then(($d) => {
                  expect(
                    this.round(
                      $el[0].offsetLeft +
                        elementRect.width +
                        reactgridRect.x +
                        $e
                    )
                  ).to.be.most(this.round($e + $d.clientWidth) + 1, "right");
                });
            });
          });
      } else {
        this.getScrollableElement().then(($scrollable) => {
          const v = $scrollable[0];
          const topOffset = this.getTopAddtionalOffset(true);
          const bottomOffset = this.getBottomAddtionalOffset(true);
          const leftOffset = this.getLeftAddtionalOffset(true);
          const rightOffset = this.getRightAddtionalOffset();

          expect($el[0].offsetTop + topOffset).to.be.least(
            v.scrollTop - 1,
            "top"
          );
          expect(
            $el[0].offsetTop + elementRect.height + bottomOffset
          ).to.be.most(v.scrollTop + v.clientHeight + 1, "bottom");
          expect($el[0].offsetLeft + leftOffset).to.be.least(
            v.scrollLeft - 1,
            "left"
          );
          expect(
            $el[0].offsetLeft + elementRect.width + rightOffset
          ).to.be.most(v.scrollLeft + v.clientWidth + 1, "right");
        });
      }
    });
  }

  assertScrolledToTop(): void {
    if (this.config.pinToBody) {
      cy.window()
        .its("scrollY")
        .then(($e) => {
          this.getReactGrid().then(($reactgrid) => {
            const reactgridRect = $reactgrid[0].getBoundingClientRect();
            expect(this.round($e), "Scroll top").to.be.most(
              this.round($e + reactgridRect.y)
            );
          });
        });
    } else {
      this.getScrollableElement().then(($scrollable) => {
        const v = $scrollable[0];
        const offset = this.getTopAddtionalOffset(true);
        expect(this.round(v.scrollTop), "Scroll top").to.be.most(offset);
      });
    }
  }

  assertScrolledToBottom(): void {
    if (this.config.pinToBody) {
      cy.window()
        .its("scrollY")
        .then(($e) => {
          this.getReactGrid().then(($reactgrid) => {
            const reactgridRect = $reactgrid[0].getBoundingClientRect();
            cy.document()
              .its("documentElement")
              .then(($d) => {
                const expected =
                  $e -
                  $d.clientHeight +
                  reactgridRect.y +
                  this.getConfig().rows * this.getConfig().cellHeight;
                expect(this.round($e), "Scroll bottom").to.be.least(
                  this.round(expected)
                );
              });
          });
        });
    } else {
      this.getScrollableElement().then(($scrollable) => {
        const v = $scrollable[0];
        const offset = this.getBottomAddtionalOffset(true);
        const expectedValue = this.round(v.scrollTop + v.clientHeight) + 1;
        expect(expectedValue, "Scroll bottom").to.be.least(
          this.getConfig().rows * this.getConfig().cellHeight + offset
        );
      });
    }
  }

  assertScrolledToLeft(): void {
    if (this.config.pinToBody) {
      cy.window()
        .its("scrollX")
        .then(($e) => {
          this.getReactGrid().then(($reactgrid) => {
            const reactgridRect = $reactgrid[0].getBoundingClientRect();
            expect(this.round($e)).to.be.most(this.round($e + reactgridRect.x));
          });
        });
    } else {
      this.getScrollableElement().then(($scrollable) => {
        const v = $scrollable[0];
        const offset = this.getLeftAddtionalOffset(true);
        const expectedValue = this.round(v.scrollLeft);
        expect(expectedValue, "Scroll left").to.be.most(offset);
      });
    }
  }

  assertScrolledToRight(includeLineWidth = false): void {
    if (this.config.pinToBody) {
      cy.window()
        .its("scrollX")
        .then(($e) => {
          this.getReactGrid().then(($reactgrid) => {
            const reactgridRect = $reactgrid[0].getBoundingClientRect();
            const expectedValue =
              this.round(
                $e + (includeLineWidth ? -this.getConfig().lineWidth : 0)
              ) + 1;
            cy.document()
              .its("documentElement")
              .then(($d) => {
                const toBeExpected =
                  $e -
                  $d.clientWidth +
                  reactgridRect.x +
                  this.getConfig().columns * this.getConfig().cellWidth;
                expect(expectedValue, "Scroll Right").to.be.least(
                  this.round(toBeExpected)
                );
              });
          });
        });
    } else {
      this.getScrollableElement().then(($scrollable) => {
        const v = $scrollable[0];
        const offset = this.getRightAddtionalOffset();
        const expectedValue =
          this.round(
            v.scrollLeft +
              v.clientWidth +
              (includeLineWidth ? -this.getConfig().lineWidth : 0)
          ) + 1;
        expect(expectedValue, "Scroll Right").to.be.least(
          this.getConfig().columns * this.getConfig().cellWidth + offset
        );
      });
    }
  }

  assertIsReactGridFocused(): void {
    cy.focused().should("have.class", "rg-hidden-element");
  }

  private selectCellForTestCase(test: CellEditorTestParams) {
    if (this.getConfig().pinToBody) {
      const padding = this.getConfig().withDivComponentStyles.padding || 0;
      if (typeof padding === "number") {
        this.selectCellInEditMode(
          test.click.x + padding + test.scroll.x,
          test.click.y + padding + test.scroll.y
        );
      } else {
        throw new Error(`Padding should be only an number!`);
      }
    } else {
      this.selectCellInEditMode(test.click.x, test.click.y);
    }
  }

  private setScrollValues(
    testCase: CellEditorTestParams
  ): CellEditorTestParams {
    return {
      ...testCase,
      ...(!testCase.scroll && {
        scroll: {
          x: 0,
          y: 0,
        },
      }),
    };
  }

  private moveClickPosByOnePixel(
    test: CellEditorTestParams
  ): CellEditorTestParams {
    return {
      ...test,
      click: {
        x: test.click.x - 1,
        y: test.click.y - 1,
      },
    };
  }

  testCellEditor(testCase: CellEditorTestParams): void {
    let test: CellEditorTestParams = this.setScrollValues(testCase);
    test = this.moveClickPosByOnePixel(test);
    this.scrollTo(test.scroll.x, test.scroll.y);
    this.selectCellForTestCase(test);
    this.assertCellEditorPosition(test);
  }

  testCellEditorOnSticky(testCase: CellEditorTestParams): void {
    let test: CellEditorTestParams = this.setScrollValues(testCase);
    test = this.moveClickPosByOnePixel(test);
    if (this.getConfig().pinToBody) {
      test = {
        ...test,
        click: {
          x: test.click.x - (test.scroll.x !== 0 ? this.config.cellWidth : 0),
          y: test.click.y - (test.scroll.y !== 0 ? this.config.cellHeight : 0),
        },
      };
    }
    this.scrollTo(test.scroll.x, test.scroll.y);
    this.selectCellForTestCase(test);
    this.assertCellEditorPositionOnSticky(test);
  }

  private assertCellEditorPosition(params: CellEditorTestParams) {
    const { click, scroll } = params;
    this.getCellEditor().then(($c) => {
      const cellEditor = $c[0];
      this.getReactGrid().then(($r) => {
        const reactgridRect = $r[0].getBoundingClientRect();
        const leftModulo = scroll.x % this.getConfig().cellWidth;
        const topModulo = scroll.y % this.getConfig().cellHeight;
        const expectedLeft = this.round(
          reactgridRect.left +
            scroll.x +
            click.x -
            leftModulo -
            (leftModulo === 0 ? this.getConfig().cellWidth : 0) -
            (this.getConfig().pinToBody ? 0 : 1) -
            this.getLeftAddtionalOffset(false) -
            (this.getConfig().additionalContent && this.getConfig().flexRow
              ? this.getConfig().cellWidth - leftModulo
              : 0) +
            (!this.getConfig().pinToBody ? 1 : 0),
          0
        );
        const expectedTop = this.round(
          reactgridRect.top +
            scroll.y +
            click.y -
            topModulo -
            (topModulo === 0 ? this.getConfig().cellHeight : 0) -
            (this.getConfig().pinToBody ? 0 : 1) -
            this.getTopAddtionalOffset(false) +
            (!this.getConfig().pinToBody ? 1 : 0),
          0
        );
        const realLeft = this.round(
          parseFloat(cellEditor.style.left.replace("px", "")),
          0
        );
        const realTop = this.round(
          parseFloat(cellEditor.style.top.replace("px", "")),
          0
        );
        expect(expectedLeft).to.be.equal(realLeft, "Left distance");
        expect(expectedTop).to.be.equal(realTop, "Top distance");
      });
    });
  }

  private assertCellEditorPositionOnSticky(params: CellEditorTestParams) {
    const { click, scroll } = params;
    this.getCellEditor().then(($c) => {
      const cellEditor = $c[0];
      this.getReactGrid().then(($r) => {
        const reactgridRect = $r[0].getBoundingClientRect();
        const isStickyTopClicked =
          click.y < this.getConfig().stickyTop * this.getConfig().cellHeight;
        const isStickyLeftClicked =
          click.x < this.getConfig().stickyLeft * this.getConfig().cellWidth;
        const isLeftScrolled = scroll.x !== 0;
        const isTopScrolled = scroll.y !== 0;
        cy.window().then(($w) => {
          // const path = $w.location.pathname;
          // const areStickyEnable = path.includes('/enableSticky');
          // const isClickedOnLeftStickyOnPinnedToBody = areStickyEnable && isStickyLeftClicked && this.getConfig().pinToBody && isLeftScrolled;
          // const isClickedOnTopStickyOnPinnedToBody = areStickyEnable && isStickyTopClicked && this.getConfig().pinToBody && isTopScrolled;
          // console.log({ areStickyEnable, isStickyLeftClicked, reactgridRect });

          const expectedLeft = this.round(
            reactgridRect.left +
              scroll.x +
              click.x -
              (!isStickyLeftClicked && isLeftScrolled
                ? scroll.x % this.getConfig().cellWidth
                : 0) -
              // - (isClickedOnLeftStickyOnPinnedToBody
              //     ? reactgridRect.left + scroll.x - 1
              //     : this.getConfig().cellWidth),
              this.getConfig().cellWidth,
            0
          );
          const expectedTop = this.round(
            reactgridRect.top +
              scroll.y +
              click.y -
              (!isStickyTopClicked && isTopScrolled
                ? scroll.y % this.getConfig().cellHeight
                : 0) -
              // - (isClickedOnTopStickyOnPinnedToBody
              //     ? reactgridRect.top + scroll.y - 1
              //     : this.getConfig().cellHeight),
              this.getConfig().cellHeight,
            0
          );
          const actualLeft = this.round(
            parseFloat(cellEditor.style.left.replace("px", "")),
            0
          );
          const actualTop = this.round(
            parseFloat(cellEditor.style.top.replace("px", "")),
            0
          );
          expect(expectedLeft).to.be.equal(actualLeft, "Left distance");
          expect(expectedTop).to.be.equal(actualTop, "Top distance");
        });
      });
    });
  }

  getPartialArea() {
    return cy.get(".rg-partial-area");
  }

  getFillHandle() {
    return cy.get(".rg-fill-handle");
  }

  getTouchFillHandle() {
    return cy.get(".rg-touch-fill-handle");
  }

  getContextMenu() {
    return cy.get(".rg-context-menu");
  }

  getContextMenuOption() {
    return cy.get(".rg-context-menu-option");
  }

  getLine() {
    return cy.get(".rg-line");
  }

  getReorderShadow() {
    return cy.get(".rg-shadow");
  }

  resizeHint() {
    return cy.get(".rg-column-resize-hint");
  }

  getRightStickyPane() {
    return cy.get(".rg-pane-right");
  }

  getBottomStickyPane() {
    return cy.get(".rg-pane-bottom");
  }

  getCellCenterX(idx: number) {
    return this.getConfig().cellWidth * (idx + 1) - this.getCellXCenter();
  }

  getCellCenterY(idy: number) {
    return this.getConfig().cellHeight * (idy + 1) - this.getCellYCenter();
  }

  selectRange(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    customEventArgs?: Record<string, unknown>,
    log = true
  ) {
    const scrollableElement = this.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      if (customEventArgs !== undefined) {
        scrollableElement.trigger("pointerdown", fromX, fromY, {
          log,
          ...customEventArgs,
          pointerType: "mouse",
        });
      } else {
        scrollableElement.trigger("pointerdown", fromX, fromY, {
          log,
          pointerType: "mouse",
        });
      }
      const body = this.getBody();
      body.trigger("pointermove", toX + offsetLeft, toY + offsetTop, {
        log,
        pointerType: "mouse",
      });
      body.trigger("pointerup", toX + offsetLeft, toY + offsetTop, {
        log,
        pointerType: "mouse",
      });
      cy.wait(200);
    });
  }

  selectRangeWithTouch(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    customEventArgs?: Record<string, unknown>,
    log = true
  ) {
    const scrollableElement = this.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      scrollableElement.trigger("pointerdown", fromX, fromY, {
        log,
        ...customEventArgs,
        pointerType: "touch",
        button: 0,
        isTrusted: true,
      });
      const body = this.getBody();
      body.trigger("pointermove", toX + offsetLeft, toY + offsetTop, {
        log,
        pointerType: "touch",
        button: 1,
      });
      body.trigger("pointermove", toX, toY + 1, {
        log: true,
        pointerType: "touch",
        button: 1,
      });
      body.trigger("pointerup", toX + offsetLeft, toY + offsetTop, {
        force: true,
        log,
        pointerType: "touch",
        button: 0,
      });
      cy.wait(200);
    });
  }

  fillCells(
    toX: number,
    toY: number,
    log = true,
    customEventArgs?: Record<string, unknown>
  ) {
    this.getFillHandle().trigger("pointerdown", {
      log,
      pointerType: "mouse",
    });
    this.getReactGridContent().should('be.visible');
    this.getReactGridContent().trigger("pointermove", toX, toY, {
      pointerType: "mouse",
      log,
    });
    cy.wait(200, { log });
    this.getReactGridContent().trigger("pointerup", toX, toY,{
      pointerType: "mouse",
      log,
      ...customEventArgs,
    });
    cy.wait(200, { log });
  }

  openContextMenu(clientX: number, clientY: number, optionValue?, log = true) {
    const rg = this.getReactGridContent();
    rg.trigger("pointerdown", clientX, clientY, {
      pointerType: "cypress",
      force: true,
      log,
    });
    rg.trigger("contextmenu", clientX, clientY, { force: true, log });
    if (optionValue !== undefined) {
      cy.wait(300);
      this.getContextMenuOption().contains(optionValue).click();
    }
    rg.trigger("pointerup", {
      clientX,
      clientY,
      pointerType: "cypress",
      force: true,
      log,
    });
  }

  resizeColumn(
    startX: number,
    startY: number,
    distance: number,
    options?: ResizeParams
  ) {
    const { log, resizeHandleClickOffset, step, beforePointerUp } = {
      log: false,
      resizeHandleClickOffset: 4, // probably need check
      step: 1,
      beforePointerUp: () => null,
      ...options,
    };
    const endingPoint = startX + distance + resizeHandleClickOffset;
    const scrollableElement = this.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      const body = this.getBody();
      scrollableElement.trigger(
        "pointerdown",
        startX - resizeHandleClickOffset + offsetLeft,
        startY + offsetTop,
        { log, pointerType: options?.useTouch ? "touch" : "mouse" }
      );
      for (
        let x = startX;
        distance < 0 ? x > endingPoint : x < endingPoint;
        x += distance > 0 ? step : -step
      ) {
        body
          .wait(3, { log: false })
          .trigger("pointermove", x + offsetLeft, startY + offsetTop, {
            log,
            force: true,
            pointerType: options?.useTouch ? "touch" : "mouse",
          });
      }
      this.getLine().should("exist");
      this.resizeHint().should("exist");
      beforePointerUp();
      body.trigger("pointerup", {
        clientX: endingPoint + offsetLeft,
        clientY: startY + offsetTop,
        force: true,
        log,
        pointerType: options?.useTouch ? "touch" : "mouse",
      });
    });

    cy.wait(200);
  }

  resizeRow(
    startX: number,
    startY: number,
    distance: number,
    options?: ResizeParams
  ) {
    const { log, resizeHandleClickOffset, step, beforePointerUp } = {
      log: false,
      resizeHandleClickOffset: 4, // probably need check
      step: 1,
      beforePointerUp: () => null,
      ...options,
    };
    const endingPoint = startY + distance + resizeHandleClickOffset;
    const scrollableElement = this.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      const body = this.getBody();
      scrollableElement.trigger(
        "pointerdown",
        startX + offsetLeft,
        startY - resizeHandleClickOffset + offsetTop,
        { log, pointerType: options?.useTouch ? "touch" : "mouse" }
      );
      for (
        let y = startY;
        distance < 0 ? y > endingPoint : y < endingPoint;
        y += distance > 0 ? step : -step
      ) {
        body
          .wait(3, { log: false })
          .trigger("pointermove", startX + offsetLeft, y + offsetTop, {
            log,
            force: true,
            pointerType: options?.useTouch ? "touch" : "mouse",
          });
      }
      this.getLine().should("exist");
      this.resizeHint().should("exist");
      beforePointerUp();
      body.trigger("pointerup", {
        clientX: startX + offsetLeft,
        clientY: endingPoint + offsetTop,
        force: true,
        log,
        pointerType: options?.useTouch ? "touch" : "mouse",
      });
    });

    cy.wait(200);
  }

  reorderColumn(
    startX: number,
    startY: number,
    distance: number,
    step = 5,
    log = false
  ) {
    const endingPoint = startX + distance;
    const scrollableElement = this.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      const body = this.getBody();
      scrollableElement.trigger(
        "pointerdown",
        startX + offsetLeft,
        startY + offsetTop,
        { log }
      );
      for (
        let x = startX;
        distance < 0 ? x > endingPoint : x < endingPoint;
        x += distance > 0 ? step : -step
      ) {
        body
          .wait(10, { log })
          .trigger("pointermove", x, startY + (x % 2), { log, force: true });
      }
      body.wait(10).trigger("pointerup", {
        clientX: endingPoint,
        clientY: startY,
        force: true,
        log,
      });
    });

    cy.wait(200);
  }

  reorderRow(
    startX: number,
    startY: number,
    distance: number,
    step = 5,
    log = false
  ) {
    const endingPoint = startY + distance;
    const scrollableElement = this.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      const body = this.getBody();
      scrollableElement.trigger(
        "pointerdown",
        startX + offsetLeft,
        startY + offsetTop,
        { log }
      );
      for (
        let y = startY;
        distance < 0 ? y > endingPoint : y < endingPoint;
        y += distance > 0 ? step : -step
      ) {
        body
          .wait(10, { log })
          .trigger(
            "pointermove",
            startX + (y % 2) + offsetLeft,
            y + offsetTop,
            { log, force: true }
          );
      }
      body.wait(300).trigger("pointerup", {
        clientX: startX,
        clientY: endingPoint,
        force: true,
        log,
      });
    });

    cy.wait(200);
  }

  moveCursorHorizontallyOnScrollable(
    startX: number,
    startY: number,
    distance: number,
    step = 5,
    log = false
  ) {
    const endingPoint = startX + distance;
    const scrollableElement = this.getScrollableElement();
    scrollableElement.then(($el) => {
      const { offsetLeft, offsetTop } = $el[0];
      const body = this.getBody();
      scrollableElement.trigger(
        "pointerdown",
        startX + offsetLeft,
        startY + offsetTop,
        { log }
      );
      for (
        let x = startX;
        distance < 0 ? x > endingPoint : x < endingPoint;
        x += distance > 0 ? step : -step
      ) {
        body.trigger("pointermove", x + offsetLeft, startY + offsetTop, {
          log,
        });
      }
      body.trigger("pointerup", {
        clientX: endingPoint + offsetLeft,
        clientY: startY + offsetTop,
        log,
        force: true,
      });
    });
  }

  moveCursorVerticallyOnScrollable(
    startX: number,
    startY: number,
    distance: number,
    step = 5,
    log = true
  ) {
    const endingPoint = startY + distance;
    const rg = this.getScrollableElement();
    const body = this.getBody();
    rg.trigger("pointerdown", startX, startY);
    for (
      let x = startY;
      distance < 0 ? x > endingPoint : x < endingPoint;
      x += distance > 0 ? step : -step
    ) {
      body.trigger("pointermove", startX, x, { log, force: true });
    }
    body.trigger("pointerup", {
      clientX: startX,
      clientY: endingPoint,
      log,
      force: true,
    });
  }

  swingCursor(
    startX: number,
    startY: number,
    direction: "horizontal" | "vertical",
    repeations: number,
    log = false
  ) {
    for (let i = 0; i < repeations; i++) {
      cy.wait(10, { log });
      const delta = i % 2;
      if (direction === "horizontal") {
        this.getBody().trigger("pointermove", {
          clientX: startX + delta,
          clientY: startY,
          force: true,
          log,
        });
      } else if (direction === "vertical") {
        this.getBody().trigger("pointermove", {
          clientX: startX,
          clientY: startY + delta,
          force: true,
          log,
        });
      } else {
        cy.log("Unknown cursor swing direction!");
      }
    }
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getTopAddtionalOffset(pixelTolerance = false): number {
    return this.getConfig().additionalContent
      ? this.getConfig().flexRow
        ? 0
        : this.getConfig().rgViewportHeight - (pixelTolerance ? 1 : 0)
      : 0;
  }

  private getBottomAddtionalOffset(pixelTolerance = false): number {
    return this.getConfig().additionalContent
      ? this.getConfig().flexRow
        ? 0
        : this.getConfig().rgViewportHeight + (pixelTolerance ? 1 : 0)
      : 0;
  }

  private getLeftAddtionalOffset(pixelTolerance = false): number {
    return this.getConfig().additionalContent
      ? this.getConfig().flexRow
        ? this.getConfig().rgViewportWidth - (pixelTolerance ? 1 : 0)
        : 0
      : 0;
  }

  private getRightAddtionalOffset(pixelTolerance = false): number {
    return this.getConfig().additionalContent
      ? this.getConfig().flexRow
        ? this.getConfig().rgViewportWidth + (pixelTolerance ? 1 : 0)
        : 0
      : 0;
  }
}
