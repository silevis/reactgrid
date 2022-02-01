/// <reference types="cypress" />

export function visit(): void {
    cy.visit('/');
}

export function visitSticky(): void {
    cy.visit('/enableSticky');
}

export function visitFrozenFocus(): void {
    cy.visit('/enableFrozenFocus');
}

export function visitPinnedToBody(): void {
    cy.visit('/enablePinnedToBody');
}

export function visitAdditionalContent(): void {
    cy.visit('/enableAdditionalContent');
}

export function visitAdditionalContentWithFlexRow(): void {
    cy.visit('/enableAdditionalContent?flexRow=true');
}

export function visitStickyPinnedToBody(): void {
    cy.visit('/enableStickyPinnedToBody');
}

export function visitHeaders(): void {
    cy.visit('/enableHeaders');
}

export function visitColumnAndRowSelections(): void {
    cy.visit('/enableColumnAndRowSelection');
}

export function visitColumnAndRowSelectionsWithSticky(): void {
    cy.visit('/enableColumnAndRowSelectionWithSticky');
}

export function visitSymetric(): void {
    cy.visit('/enableSymetric');
}

export function visitSpannedCells(): void {
    cy.visit('/enableSpannedCells');
}

export function visitResponsiveStickyTopLeft(): void {
    cy.visit('/enableResponsiveStickyTopLeft');
}

export function visitResponsiveStickyBottomRight(): void {
    cy.visit('/enableResponsiveStickyBottomRight');
}

export function visitResponsiveStickyPinnedToBodyTopLeft(): void {
    cy.visit('/enableResponsiveStickyPinnedToBodyTopLeft');
}

export function visitResponsiveStickyPinnedToBodyBottomRight(): void {
    cy.visit('/enableResponsiveStickyPinnedToBodyBottomRight');
}

export function visitDisabledVirtualScrolling(): void {
    cy.visit('/disableVirtualScrolling');
}
