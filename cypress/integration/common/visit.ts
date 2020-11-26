export function visit() {
    cy.visit('/');
}

export function visitSticky() {
    cy.visit('/enableSticky');
}

export function visitFrozenFocus() {
    cy.visit('/enableFrozenFocus');
}