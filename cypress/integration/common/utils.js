/// <reference types="cypress" />

const Constants = require('./constants');
const config = require('../../../src/test/testEnvConfig');

class Utils {

    visit() {
        cy.visit('/');
    }

    visitSticky() {
        cy.visit('/enableSticky');
    }

    isMacOs() {
        return Cypress.platform === 'darwin';
    }

    getCell(x, y) {
        return cy.get(`[data-cell-colidx=${x}][data-cell-rowidx=${y}]`).eq(0);
    }

    getScrollableElement() {
        // TODO is Body correct element for getting scroll and sroll view?
        return config.pinToBody ? this.getBody() : this.getDivScrollableElement();
    }

    getDivScrollableElement() {
        return cy.get('[data-cy=div-scrollable-element]');
    }

    getReactGrid() {
        return cy.get('[data-cy=reactgrid]');
    }

    getReactGridContent() {
        return cy.get('[data-cy=reactgrid-content]');
    }

    getOuterInput() {
        return cy.get('[data-cy=outer-input]');
    }

    getCellEditor() {
        return cy.get('[data-cy=rg-celleditor]');
    }

    getBody() {
        return cy.get('body');
    }

    getCellFocus() {
        const cell = cy.get('[data-cy=rg-cell-focus]')
        cell.should('exist');
        return cell;
    }

    getCellHighlight() {
        return cy.get('[data-cy=rg-cell-highlight]');
    }

    selectCell(clientX, clientY, customEventArgs) {
        const scrollableElement = this.getScrollableElement();
        if (customEventArgs !== undefined) {
            scrollableElement.trigger('pointerdown', clientX, clientY, { ...customEventArgs, pointerType: 'mouse' });
        } else {
            scrollableElement.trigger('pointerdown', clientX, clientY, { pointerType: 'mouse' });
        }
        scrollableElement.trigger('pointerup', clientX, clientY, { force: true, pointerType: 'mouse' });
        cy.wait(500);
    }

    scrollTo(left, top) {
        return this.getScrollableElement().scrollTo(left, top, { duration: 500 });
    }

    scrollToBottom(left = 0) {
        return this.scrollTo(left, config.rows * config.cellHeight);
    }

    getCellXCenter() {
        return config.cellWidth / 2;
    }

    getCellYCenter() {
        return config.cellHeight / 2;
    }

    scrollToRight(top = 0) {
        this.scrollTo(config.columns * config.cellWidth, top);
    }

    assertElementWidthIsEqual(element, expectedWidth) {
        element.invoke('css', 'width').then(str => parseInt(str)).should('be.eq', expectedWidth);
    }

    assertElementHeightIsEqual(element, expectedHeight) {
        element.invoke('css', 'height').then(str => parseInt(str)).should('be.eq', expectedHeight);
    }

    assertElementTopIsEqual(element, expectedTop) {
        element.invoke('css', 'top').then(str => parseInt(str)).should('be.eq', expectedTop);
    }

    assertElementBottomIsEqual(element, expectedTop) {
        element.invoke('css', 'bottom').then(str => parseInt(str)).should('be.eq', expectedTop);
    }

    assertElementLeftIsEqual(element, expectedLeft) {
        element.invoke('css', 'left').then(str => parseInt(str)).should('be.eq', expectedLeft);
    }

    assertElementRightIsEqual(element, expectedRight) {
        element.invoke('css', 'right').then(str => parseInt(str)).should('be.eq', expectedRight);
    }

    assertIsElementInScrollable(element) {
        element.then($el => {
            this.getScrollableElement().then($scrollable => {
                const v = $scrollable[0];
                const elementRect = $el[0].getBoundingClientRect();
                expect($el[0].offsetTop).to.be.least(v.scrollTop - 1, 'top')
                expect($el[0].offsetTop + elementRect.height).to.be.most(v.scrollTop + v.clientHeight + 1, 'bottom')
                expect($el[0].offsetLeft).to.be.least(v.scrollLeft - 1, 'left')
                expect($el[0].offsetLeft + elementRect.width).to.be.most(v.scrollLeft + v.clientWidth + 1, 'right')
            });
        });
    }

    selectCellInEditMode(clientX, clientY) {
        this.selectCell(clientX, clientY)
        this.keyDown(Constants.keyCodes.Enter, { force: true });
    }

    randomText() {
        return Math.random()
            .toString(36)
            .substring(7);
    }

    selectCellByTouch(clientX, clientY) {
        this.getReactGridContent().click(clientX, clientY, { clientX: clientX, clientY: clientY });
    }


    resetSelection(x, y) {
        this.selectCell(x, y + config.cellHeight);
        this.selectCell(x, y);
    }

    assertScrolledToTop() {
        this.getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            expect(Math.round((v.scrollTop)), 'Scroll top').to.be.eq(0)
        });
    }

    assertScrolledToBottom(includeLineWidth = false) {
        this.getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            expect(Math.round((v.scrollTop + v.clientHeight + (includeLineWidth ? -config.lineWidth : 0)) + 1), 'Scroll bottom')
                .to.be.least(config.rows * config.cellHeight)
        });
    }

    assertScrolledToLeft() {
        this.getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            expect(Math.round((v.scrollLeft)), 'Scroll left').to.be.eq(0);
        });
    }

    assertScrolledToRight(includeLineWidth = false) {
        this.getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            expect(Math.round((v.scrollLeft + v.clientWidth + (includeLineWidth ? -config.lineWidth : 0)) + 1), 'Scroll Right')
                .to.be.least(config.columns * config.cellWidth);
        });
    }

    keyDown(keyCode, customEventArgs, timeout = 200, log = true) {
        const rg = this.getReactGridContent();
        if (customEventArgs !== undefined) {
            rg.trigger('keydown', Object.assign({}, { keyCode, log, force: true }, customEventArgs));
        } else {
            rg.trigger('keydown', { keyCode, log, force: true });
        }
        rg.trigger('keyup', { force: true, log });
        cy.wait(timeout, { log });
    }
}

const utils = new Utils();
module.exports = utils;
