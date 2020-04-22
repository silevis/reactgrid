import { PointerLocation, GridRow, GridColumn, Direction, State } from '../Model';
import { getScrollOfScrollableElement } from './scrollHelpers';
import { getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';

export function getLocationFromClient(state: State, clientX: number, clientY: number, favorScrollableContent?: Direction): PointerLocation {
    const { left, top } = state.reactGridElement!.getBoundingClientRect();
    const viewportX = clientX - left;
    const viewportY = clientY - top;

    const { cellY, row } = getRow(state, viewportY, favorScrollableContent === 'vertical' || favorScrollableContent === 'both');
    const { cellX, column } = getColumn(state, viewportX, favorScrollableContent === 'horizontal' || favorScrollableContent === 'both');
    return { row, column, viewportX, viewportY, cellX, cellY };
}

function getRow(state: State, viewportY: number, favorScrollableContent: boolean): { cellY: number, row: GridRow } {
    const result: { cellY: number, row: GridRow } = getStickyTopRow(state, viewportY, favorScrollableContent) || getScrollableContentRow(state, viewportY);
    return result;
}

function getColumn(state: State, viewportX: number, favorScrollableContent: boolean): { cellX: number, column: GridColumn } {
    const result: { cellX: number, column: GridColumn } = getLeftStickyColumn(state, viewportX, favorScrollableContent) || getScrollableContentColumn(state, viewportX);
    return result;
}

export function getStickyTopRow(state: State, viewportY: number, favorScrollableContent: boolean): { cellY: number, row: GridRow } | undefined {
    const cellMatrix = state.cellMatrix;
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { top } = getReactGridOffsets(state);
    const topStickyOffset = getStickyOffset(scrollTop, top);
    if (cellMatrix.stickyTopRange.rows.find(row => row.bottom > viewportY - topStickyOffset) && viewportY < cellMatrix.stickyTopRange.height + topStickyOffset && !(favorScrollableContent && scrollTop > top)) {
        const row = cellMatrix.stickyTopRange.rows.find(row => row.bottom > viewportY - topStickyOffset)!;
        const cellY = viewportY - row.top;
        return { cellY, row };
    }
}

export function getLeftStickyColumn(state: State, viewportX: number, favorScrollableContent: boolean): { cellX: number, column: GridColumn } | undefined {
    const cellMatrix = state.cellMatrix;
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { left } = getReactGridOffsets(state);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);
    if (cellMatrix.stickyLeftRange.columns.find(column => column.right > viewportX - leftStickyOffset) && viewportX < cellMatrix.stickyLeftRange.height + leftStickyOffset && !(favorScrollableContent && scrollLeft > left)) {
        const column = cellMatrix.stickyLeftRange.columns.find(column => column.right > viewportX - leftStickyOffset)!;
        const cellX = viewportX - column.left;
        return { cellX, column };
    }
}

export function getScrollableContentRow(state: State, viewportY: number): { cellY: number, row: GridRow } {
    const cellMatrix = state.cellMatrix;
    const scrollableContentY = viewportY - cellMatrix.stickyTopRange.height;
    const row = cellMatrix.scrollableRange.rows.find(row => row.bottom >= scrollableContentY) || cellMatrix.scrollableRange.last.row;
    const cellY = scrollableContentY - row.top;
    return { cellY, row };
}

export function getScrollableContentColumn(state: State, viewportX: number): { cellX: number, column: GridColumn } {
    const cellMatrix = state.cellMatrix;
    const scrollableContentX = viewportX - cellMatrix.stickyLeftRange.width;
    const column = cellMatrix.scrollableRange.columns.find(column => column.right >= scrollableContentX) || cellMatrix.scrollableRange.last.column;
    const cellX = scrollableContentX - column.left;
    return { cellX, column };
} 