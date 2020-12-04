/// <reference types="cypress" />

export function visit() {
    cy.visit('/');
}

export function visitSticky() {
    cy.visit('/enableSticky');
}

export function visitFrozenFocus() {
    cy.visit('/enableFrozenFocus');
}

export function visitPinnedToBody() {
    cy.visit('/enablePinnedToBody');
}

export function visitAdditionalContent() {
    cy.visit('/enableAdditionalContent');
}

export function visitAdditionalContentWithFlexRow() {
    cy.visit('/enableAdditionalContent?flexRow=true');
}

export function visitStickyPinnedToBody() {
    cy.visit('/enableStickyPinnedToBody');
}

export function visitHeaders() {
    cy.visit('/enableHeaders');
}

export function visitColumnAndRowSelections() {
    cy.visit('/enableColumnAndRowSelection');
}

export function visitColumnAndRowSelectionsWithSticky() {
    cy.visit('/enableColumnAndRowSelectionWithSticky');
}
