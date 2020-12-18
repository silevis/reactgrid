/// <reference types="cypress" />

import { constants } from './constants';
import { TestConfig } from '../../../src/test/testEnvConfig';

export interface CellEditorTestParams {
    scroll: {
        x: number,
        y: number
    },
    click: {
        x: number,
        y: number
    };
}

export class Utilities {

    constructor(private config: TestConfig) { }

    getConfig(): TestConfig {
        return this.config;
    }

    isMacOs() {
        return Cypress.platform === 'darwin';
    }

    selectCell(clientX: number, clientY: number, customEventArgs = undefined) {
        const scrollableElement = this.getScrollableElement();
        if (customEventArgs !== undefined) {
            scrollableElement.trigger('pointerdown', clientX, clientY, { ...customEventArgs, pointerType: 'mouse' });
        } else {
            scrollableElement.trigger('pointerdown', clientX, clientY, { pointerType: 'mouse' });
        }
        scrollableElement.trigger('pointerup', clientX, clientY, { force: true, pointerType: 'mouse' });
        cy.wait(500);
    }

    scrollTo(left: number, top: number, duration = 500) {
        return this.config.pinToBody ? cy.scrollTo(left, top, { duration, ensureScrollable: true }) :
            this.getScrollableElement().scrollTo(left, top, { duration, ensureScrollable: true });
    }

    wait() {
        return this.isMacOs() ? 50 : 100;
    }

    scrollToBottom(left = 0) {
        const offset = this.getBottomAddtionalOffset();
        return this.scrollTo(left, this.getConfig().rows * this.getConfig().cellHeight + offset);
    }

    scrollToRight(top = 0) {
        const offset = this.getRightAddtionalOffset();
        this.scrollTo(this.getConfig().columns * this.getConfig().cellWidth + offset, top);
    }

    getCellXCenter() {
        return this.getConfig().cellWidth / 2;
    }

    getCellYCenter() {
        return this.getConfig().cellHeight / 2;
    }

    selectCellInEditMode(clientX: number, clientY: number) {
        this.selectCell(clientX, clientY);
        this.keyDown(constants.keyCodes.Enter, { force: true });
    }

    randomText(): string {
        return Math.random()
            .toString(36)
            .substring(7);
    }

    round(value: number, places = 0): number {
        return +(Math.round(((value + "e+" + places) as unknown) as number) + "e-" + places);
    }

    resetSelection(x: number, y: number) {
        this.selectCell(x, y + this.getConfig().cellHeight);
        this.selectCell(x, y);
    }

    keyDown(keyCode: number, customEventArgs?: {}, timeout = 200, log = true) {
        const rg = this.getReactGridContent();
        if (customEventArgs !== undefined) {
            rg.trigger('keydown', { ...customEventArgs, keyCode, log, force: true });
        } else {
            rg.trigger('keydown', { keyCode, log, force: true });
        }
        rg.trigger('keyup', { force: true, log });
        cy.wait(timeout, { log });
    }

    getCell(x: number, y: number) {
        return cy.get(`[data-cell-colidx=${x}][data-cell-rowidx=${y}]`).eq(0);
    }

    getScrollableElement() {
        // TODO is Body correct element for getting scroll and sroll view?
        return this.config.pinToBody ? this.getBody() : this.getDivScrollableElement();
    }

    getDivScrollableElement() {
        return cy.get('.test-grid-container');
    }

    getReactGrid() {
        return cy.get('.reactgrid');
    }

    getReactGridContent() {
        return cy.get('.reactgrid-content');
    }

    getOuterInput() {
        return cy.get('[data-cy=outer-input]');
    }

    getCellEditor() {
        return cy.get('.rg-celleditor');
    }

    getBody() {
        return cy.get('body');
    }

    getLeftStickyPane() {
        return cy.get('.rg-pane-left');
    }

    getTopStickyPane() {
        return cy.get('.rg-pane-top');
    }

    getCellFocus() {
        const cell = cy.get('.rg-cell-focus');
        cell.should('exist');
        return cell;
    }

    getCellHighlight() {
        return cy.get('.rg-cell-highlight');
    }

    getDropdownMenu() {
        return cy.get('.dropdown-menu');
    }

    click(x: number, y: number) {
        this.getScrollableElement().trigger('pointerdown', x, y, { pointerType: 'mouse' });
        this.getBody().trigger('pointerup', 0, 0, { pointerType: 'mouse', force: true }); // 
    }

    assertElementWidthIsEqual(element: Cypress.Chainable, expectedWidth: number): void {
        element.invoke('css', 'width').then(str => parseInt(str)).should('be.eq', expectedWidth);
    }

    assertElementHeightIsEqual(element: Cypress.Chainable, expectedHeight: number): void {
        element.invoke('css', 'height').then(str => parseInt(str)).should('be.eq', expectedHeight);
    }

    assertElementTopIsEqual(element: Cypress.Chainable, expectedTop: number): void {
        element.invoke('css', 'top').then(str => parseInt(str)).should('be.eq', expectedTop);
    }

    assertElementBottomIsEqual(element: Cypress.Chainable, expectedBottom: number): void {
        element.invoke('css', 'bottom').then(str => parseInt(str)).should('be.eq', expectedBottom);
    }

    assertElementLeftIsEqual(element: Cypress.Chainable, expectedLeft: number): void {
        element.invoke('css', 'left').then(str => parseInt(str)).should('be.eq', expectedLeft);
    }

    assertElementRightIsEqual(element: Cypress.Chainable, expectedRight: number): void {
        element.invoke('css', 'right').then(str => parseInt(str)).should('be.eq', expectedRight);
    }

    assertIsElementInScrollable(element: Cypress.Chainable<JQuery<HTMLElement>>): void {
        element.then($el => {
            const elementRect = $el[0].getBoundingClientRect();
            if (this.config.pinToBody) {
                cy.window().its('scrollY').then($e => {
                    this.getReactGrid().then($reactgrid => {
                        const reactgridRect = $reactgrid[0].getBoundingClientRect();
                        expect(this.round(reactgridRect.y + $el[0].offsetTop + $e)).to.be.least(this.round($e - 1), 'top');
                        cy.document().its('documentElement').then($d => {
                            expect(this.round($el[0].offsetTop + elementRect.height + reactgridRect.y + $e)).to.be.most(this.round($e + $d[0].clientHeight) + 1, 'bottom');
                        });
                    })
                });
                cy.window().its('scrollX').then($e => {
                    this.getReactGrid().then($reactgrid => {
                        const reactgridRect = $reactgrid[0].getBoundingClientRect();
                        expect(this.round(reactgridRect.x + $el[0].offsetLeft + $e)).to.be.least(this.round($e - 1), 'left');
                        cy.document().its('documentElement').then($d => {
                            expect(this.round($el[0].offsetLeft + elementRect.width + reactgridRect.x + $e)).to.be.most(this.round($e + $d[0].clientWidth) + 1, 'right');
                        });
                    })
                });
            } else {
                this.getScrollableElement().then($scrollable => {
                    const v = $scrollable[0];
                    const topOffset = this.getTopAddtionalOffset();
                    const bottomOffset = this.getBottomAddtionalOffset();
                    const leftOffset = this.getLeftAddtionalOffset()
                    const rightOffset = this.getRightAddtionalOffset();

                    expect($el[0].offsetTop + topOffset).to.be.least(v.scrollTop - 1, 'top');
                    expect($el[0].offsetTop + elementRect.height + bottomOffset).to.be.most(v.scrollTop + v.clientHeight + 1, 'bottom');
                    expect($el[0].offsetLeft + leftOffset).to.be.least(v.scrollLeft - 1, 'left');
                    expect($el[0].offsetLeft + elementRect.width + rightOffset).to.be.most(v.scrollLeft + v.clientWidth + 1, 'right')
                });
            }
        });
    }

    assertScrolledToTop(): void {
        if (this.config.pinToBody) {
            cy.window().its('scrollY').then($e => {
                this.getReactGrid().then($reactgrid => {
                    const reactgridRect = $reactgrid[0].getBoundingClientRect();
                    console.log(reactgridRect)
                    expect(this.round($e), 'Scroll top').to.be.most(this.round($e + reactgridRect.y))
                })
            });
        }
        else {
            this.getScrollableElement().then($scrollable => {
                const v = $scrollable[0];
                const offset = this.getTopAddtionalOffset();
                expect(this.round(v.scrollTop), 'Scroll top').to.be.most(offset)
            });
        }
    }

    assertScrolledToBottom(): void {
        if (this.config.pinToBody) {
            cy.window().its('scrollY').then($e => {
                this.getReactGrid().then($reactgrid => {
                    const reactgridRect = $reactgrid[0].getBoundingClientRect();
                    console.log(reactgridRect)
                    cy.document().its('documentElement').then($d => {
                        expect(this.round($e), 'Scroll bottom').to.be.least(this.round($e - $d[0].clientHeight + reactgridRect.y + this.getConfig().rows * this.getConfig().cellHeight));
                    });
                })
            });
        }
        else {
            this.getScrollableElement().then($scrollable => {
                const v = $scrollable[0];
                const offset = this.getBottomAddtionalOffset();
                const expectedValue = this.round(v.scrollTop + v.clientHeight) + 1;
                expect(expectedValue, 'Scroll bottom').to.be.least(this.getConfig().rows * this.getConfig().cellHeight + offset);
            });
        }
    }

    assertScrolledToLeft(): void {
        if (this.config.pinToBody) {
            cy.window().its('scrollX').then($e => {
                this.getReactGrid().then($reactgrid => {
                    const reactgridRect = $reactgrid[0].getBoundingClientRect();
                    expect(this.round($e)).to.be.most(this.round($e + reactgridRect.x));
                })
            });
        }
        else {
            this.getScrollableElement().then($scrollable => {
                const v = $scrollable[0];
                const offset = this.getLeftAddtionalOffset();
                const expectedValue = this.round(v.scrollLeft);
                expect(expectedValue, 'Scroll left').to.be.most(offset);
            });
        }
    }

    assertScrolledToRight(includeLineWidth = false): void {
        if (this.config.pinToBody) {
            cy.window().its('scrollX').then($e => {
                this.getReactGrid().then($reactgrid => {
                    const reactgridRect = $reactgrid[0].getBoundingClientRect();
                    const expectedValue = this.round($e + (includeLineWidth ? -this.getConfig().lineWidth : 0)) + 1;
                    cy.document().its('documentElement').then($d => {
                        expect(expectedValue, 'Scroll Right').to.be.least(this.round($e - $d[0].clientWidth + reactgridRect.x + this.getConfig().columns * this.getConfig().cellWidth));
                    });
                })
            });
        }
        else {
            this.getScrollableElement().then($scrollable => {
                const v = $scrollable[0];
                const offset = this.getRightAddtionalOffset();
                const expectedValue = this.round(v.scrollLeft + v.clientWidth + (includeLineWidth ? -this.getConfig().lineWidth : 0)) + 1;
                expect(expectedValue, 'Scroll Right').to.be.least(this.getConfig().columns * this.getConfig().cellWidth + offset);
            });
        }
    }

    assertIsReactGridFocused() {
        cy.focused().should('have.class', 'rg-hidden-element');
    }

    testCellEditor(testCase: CellEditorTestParams) {
        this.scrollTo(testCase.scroll.x, testCase.scroll.y);
        this.selectCellInEditMode(testCase.click.x, testCase.click.y);
        this.assertCellEditorPosition(testCase);
    }

    testCellEditorOnSticky(testCase: CellEditorTestParams) {
        this.scrollTo(testCase.scroll.x, testCase.scroll.y);
        this.selectCellInEditMode(testCase.click.x, testCase.click.y);
        this.assertCellEditorPositionOnSticky(testCase);
    }

    assertCellEditorPosition(params: CellEditorTestParams) {
        const { click, scroll } = params;
        this.getCellEditor().then($c => {
            const cellEditor = $c[0];
            this.getReactGrid().then($r => {
                const reactgridRect = $r[0].getBoundingClientRect();
                const expectedLeft = this.round(reactgridRect.left + scroll.x + click.x - (scroll.x % this.getConfig().cellWidth) - (scroll.x === 0 ? this.getConfig().cellWidth : 0) - 1, 0);
                const expectedTop = this.round(reactgridRect.top + scroll.y + click.y - (scroll.y % this.getConfig().cellHeight) - (scroll.y === 0 ? this.getConfig().cellHeight : 0) - 1, 0);
                const realLeft = this.round(parseFloat(cellEditor.style.left.replace('px', '')), 0);
                const realTop = this.round(parseFloat(cellEditor.style.top.replace('px', '')), 0);
                expect(expectedLeft).to.be.equal(realLeft, 'Left distance');
                expect(expectedTop).to.be.equal(realTop, 'Top distance');
            });
        });
    }

    assertCellEditorPositionOnSticky(params: CellEditorTestParams) {
        const { click, scroll } = params;
        this.getCellEditor().then($c => {
            const cellEditor = $c[0];
            this.getReactGrid().then($r => {
                const reactgridRect = $r[0].getBoundingClientRect();
                const isStickyLeftClicked = click.x < this.getConfig().stickyLeft * this.getConfig().cellWidth;
                const isStickyTopClicked = click.y < this.getConfig().stickyTop * this.getConfig().cellHeight;
                const isLeftScrolled = scroll.x !== 0;
                const isTopScrolled = scroll.y !== 0;
                console.log({
                    s: this.getConfig().stickyLeft * this.getConfig().cellWidth,
                    c: click.x,
                    reactgridRect,
                    isStickyLeftClicked,
                    isStickyTopClicked,
                    isLeftScrolled,
                    isTopScrolled,
                    scroll,
                    click
                });
                const expectedLeft = this.round(reactgridRect.left + scroll.x + click.x
                    - (!isStickyLeftClicked && isLeftScrolled ? scroll.x % this.getConfig().cellWidth : 0)
                    - (!isLeftScrolled ? this.getConfig().cellWidth : 0)
                    - (isStickyLeftClicked && isLeftScrolled ? this.getConfig().cellWidth : 0)
                    - (isStickyLeftClicked ? 0 : 1)
                    , 0);
                const expectedTop = this.round(reactgridRect.top + scroll.y + click.y
                    - (!isStickyTopClicked && isTopScrolled ? scroll.y % this.getConfig().cellHeight : 0)
                    - (!isTopScrolled ? this.getConfig().cellHeight : 0)
                    - (isStickyTopClicked && isTopScrolled ? this.getConfig().cellHeight : 0)
                    - (isStickyTopClicked ? 0 : 1)
                    , 0);
                const realLeft = this.round(parseFloat(cellEditor.style.left.replace('px', '')), 0);
                const realTop = this.round(parseFloat(cellEditor.style.top.replace('px', '')), 0);
                expect(expectedLeft).to.be.equal(realLeft, 'Left distance');
                expect(expectedTop).to.be.equal(realTop, 'Top distance');
            });
        });
    }

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * simplyfy this methods
     */
    private getTopAddtionalOffset(): number {
        return this.getConfig().additionalContent ? this.getConfig().flexRow ? 0 : this.getConfig().rgViewportHeight - 1 : 0;
    }

    private getBottomAddtionalOffset(): number {
        return this.getConfig().additionalContent ? this.getConfig().flexRow ? 0 : this.getConfig().rgViewportHeight + 1 : 0;
    }

    private getLeftAddtionalOffset(): number {
        return this.getConfig().additionalContent ? this.getConfig().flexRow ? this.getConfig().rgViewportWidth - 1 : 0 : 0;
    }

    private getRightAddtionalOffset(): number {
        return this.getConfig().additionalContent ? this.getConfig().flexRow ? this.getConfig().rgViewportWidth : 0 : 0;
    }

}
