
import { getScrollableElement } from './DOMElements';
import { Utils } from './utils';
import { config } from '../../../src/test/testEnvConfig';

export function assertElementWidthIsEqual(element, expectedWidth: number): void {
    element.invoke('css', 'width').then(str => parseInt(str)).should('be.eq', expectedWidth);
}

export function assertElementHeightIsEqual(element, expectedHeight: number): void {
    element.invoke('css', 'height').then(str => parseInt(str)).should('be.eq', expectedHeight);
}

export function assertElementTopIsEqual(element, expectedTop: number): void {
    element.invoke('css', 'top').then(str => parseInt(str)).should('be.eq', expectedTop);
}

export function assertElementBottomIsEqual(element, expectedBottom: number): void {
    element.invoke('css', 'bottom').then(str => parseInt(str)).should('be.eq', expectedBottom);
}

export function assertElementLeftIsEqual(element, expectedLeft): void {
    element.invoke('css', 'left').then(str => parseInt(str)).should('be.eq', expectedLeft);
}

export function assertElementRightIsEqual(element, expectedRight): void {
    element.invoke('css', 'right').then(str => parseInt(str)).should('be.eq', expectedRight);
}

export function assertIsElementInScrollable(element): void {
    element.then($el => {
        getScrollableElement().then($scrollable => {
            const v = $scrollable[0];
            const elementRect = $el[0].getBoundingClientRect();
            expect($el[0].offsetTop).to.be.least(v.scrollTop - 1, 'top')
            expect($el[0].offsetTop + elementRect.height).to.be.most(v.scrollTop + v.clientHeight + 1, 'bottom')
            expect($el[0].offsetLeft).to.be.least(v.scrollLeft - 1, 'left')
            expect($el[0].offsetLeft + elementRect.width).to.be.most(v.scrollLeft + v.clientWidth + 1, 'right')
        });
    });
}

export function assertScrolledToTop(): void {
    getScrollableElement().then($scrollable => {
        const v = $scrollable[0];
        expect(Utils.round(v.scrollTop), 'Scroll top').to.be.eq(0)
    });
}

export function assertScrolledToBottom(includeLineWidth = false): void {
    getScrollableElement().then($scrollable => {
        const v = $scrollable[0];
        const expectedValue = Utils.round(v.scrollTop + v.clientHeight + (includeLineWidth ? -config.lineWidth : 0)) + 1;
        expect(expectedValue, 'Scroll bottom').to.be.least(config.rows * config.cellHeight);
    });
}

export function assertScrolledToLeft(): void {
    getScrollableElement().then($scrollable => {
        const v = $scrollable[0];
        const expectedValue = Utils.round(v.scrollLeft);
        expect(expectedValue, 'Scroll left').to.be.eq(0);
    });
}

export function assertScrolledToRight(includeLineWidth = false): void {
    getScrollableElement().then($scrollable => {
        const v = $scrollable[0];
        const expectedValue = Utils.round(v.scrollLeft + v.clientWidth + (includeLineWidth ? -config.lineWidth : 0)) + 1;
        expect(expectedValue, 'Scroll Right').to.be.least(config.columns * config.cellWidth);
    });
}