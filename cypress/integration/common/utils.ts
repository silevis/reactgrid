/// <reference types="cypress" />

import { constants } from './constants';
import { config, TestConfig } from '../../../src/test/testEnvConfig';

export class Utilities {

    constructor(private config: TestConfig) { }

    getConfig(): TestConfig {
        return config;
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
        return this.getScrollableElement().scrollTo(left, top, { duration });
    }

    wait() {
        return this.isMacOs() ? 50 : 500;
    }

    scrollToBottom(left = 0) {
        return this.scrollTo(left, config.rows * config.cellHeight);
    }

    scrollToRight(top = 0) {
        this.scrollTo(config.columns * config.cellWidth, top);
    }

    getCellXCenter() {
        return config.cellWidth / 2;
    }

    getCellYCenter() {
        return config.cellHeight / 2;
    }

    selectCellInEditMode(clientX: number, clientY: number) {
        this.selectCell(clientX, clientY)
        this.keyDown(constants.keyCodes.Enter, { force: true });
    }

    randomText(): string {
        return Math.random()
            .toString(36)
            .substring(7);
    }

    round(value: number): number {
        return Math.round(value);
    }

    resetSelection(x: number, y: number) {
        this.selectCell(x, y + config.cellHeight);
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
            this.getScrollableElement().then($scrollable => {
                const v = $scrollable[0];
                const elementRect = $el[0].getBoundingClientRect();
                const topOffset = (this.config.additionalContent ? this.config.flexRow ? 0 : this.config.rgViewportHeight - 1 : 0);
                const bottomOffset = (this.config.additionalContent ? this.config.flexRow ? 0 : this.config.rgViewportHeight + 1 : 0);
                const leftOffset = this.config.additionalContent ? this.config.flexRow ? this.config.rgViewportWidth - 1 : 0 : 0;
                const rightOffset = this.config.additionalContent ? this.config.flexRow ? this.config.rgViewportWidth : 0 : 0;

                expect($el[0].offsetTop + topOffset).to.be.least(v.scrollTop - 1, 'top');
                expect($el[0].offsetTop + elementRect.height + bottomOffset).to.be.most(v.scrollTop + v.clientHeight + 1, 'bottom');
                expect($el[0].offsetLeft + leftOffset).to.be.least(v.scrollLeft - 1, 'left');
                expect($el[0].offsetLeft + elementRect.width + rightOffset).to.be.most(v.scrollLeft + v.clientWidth + 1, 'right')
            });
        });
    }

    assertScrolledToTop(): void {
        this.getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            expect(this.round(v.scrollTop), 'Scroll top').to.be.eq(0)
        });
    }

    assertIsReactGridFocused() {
        cy.focused().should('have.class', 'rg-hidden-element');
    }

    assertScrolledToBottom(): void {
        this.getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            const expectedValue = this.round(v.scrollTop + v.clientHeight) + 1;
            expect(expectedValue, 'Scroll bottom').to.be.least(config.rows * config.cellHeight);
        });
    }

    assertScrolledToLeft(): void {
        this.getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            const expectedValue = this.round(v.scrollLeft);
            expect(expectedValue, 'Scroll left').to.be.eq(0);
        });
    }

    assertScrolledToRight(includeLineWidth = false): void {
        this.getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            const expectedValue = this.round(v.scrollLeft + v.clientWidth + (includeLineWidth ? -config.lineWidth : 0)) + 1;
            expect(expectedValue, 'Scroll Right').to.be.least(config.columns * config.cellWidth);
        });
    }

}
