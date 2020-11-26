/// <reference types="cypress" />

import { constants } from './constants';
import { getReactGridContent, getScrollableElement } from './DOMElements';
import { config } from '../../../src/test/testEnvConfig';

class Utilities {

    isMacOs() {
        return Cypress.platform === 'darwin';
    }

    selectCell(clientX: number, clientY: number, customEventArgs = undefined) {
        const scrollableElement = getScrollableElement();
        if (customEventArgs !== undefined) {
            scrollableElement.trigger('pointerdown', clientX, clientY, { ...customEventArgs, pointerType: 'mouse' });
        } else {
            scrollableElement.trigger('pointerdown', clientX, clientY, { pointerType: 'mouse' });
        }
        scrollableElement.trigger('pointerup', clientX, clientY, { force: true, pointerType: 'mouse' });
        cy.wait(500);
    }

    scrollTo(left: number, top: number, duration = 500) {
        return getScrollableElement().scrollTo(left, top, { duration });
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

    selectCellInEditMode(clientX, clientY) {
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

    resetSelection(x, y) {
        this.selectCell(x, y + config.cellHeight);
        this.selectCell(x, y);
    }

    keyDown(keyCode, customEventArgs, timeout = 200, log = true) {
        const rg = getReactGridContent();
        if (customEventArgs !== undefined) {
            rg.trigger('keydown', Object.assign({}, { keyCode, log, force: true }, customEventArgs));
        } else {
            rg.trigger('keydown', { keyCode, log, force: true });
        }
        rg.trigger('keyup', { force: true, log });
        cy.wait(timeout, { log });
    }
}

export const Utils = new Utilities();
