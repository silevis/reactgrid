/// <reference types="cypress" />

import { config } from '../../../src/test/testEnvConfig';

export function getCell(x: number, y: number) {
    return cy.get(`[data-cell-colidx=${x}][data-cell-rowidx=${y}]`).eq(0);
}

export function getScrollableElement() {
    // TODO is Body correct element for getting scroll and sroll view?
    return config.pinToBody ? getBody() : getDivScrollableElement();
}

export function getDivScrollableElement() {
    return cy.get('.test-grid-container');
}

export function getReactGrid() {
    return cy.get('.reactgrid');
}

export function getReactGridContent() {
    return cy.get('.reactgrid-content');
}

export function getOuterInput() {
    return cy.get('[data-cy=outer-input]');
}

export function getCellEditor() {
    return cy.get('.rg-celleditor');
}

export function getBody() {
    return cy.get('body');
}

export function getCellFocus() {
    const cell = cy.get('.rg-cell-focus')
    cell.should('exist');
    return cell;
}

export function getCellHighlight() {
    return cy.get('.rg-cell-highlight');
}
