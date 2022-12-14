import { Direction, GridColumn, GridRow, PointerLocation } from '../Model/InternalModel';
import { getScrollOfScrollableElement } from './scrollHelpers';
import { getReactGridOffsets, getSizeOfElement, getStickyOffset, getVisibleSizeOfReactGrid } from './elementSizeHelpers';
import { State } from '../Model/State';

// TODO: rewrite without division
export function getLocationFromClient(
    state: State,
    clientX: number,
    clientY: number,
    favorScrollableContent?: Direction
  ): PointerLocation {
    if (!state.reactGridElement) {
      throw new Error(
        `"state.reactGridElement" field should be initiated before calling the "getBoundingClientRect()"`
      );
    }
    const { left, top } = state.reactGridElement.getBoundingClientRect();
    const viewportX = clientX - left;
    const viewportY = clientY - top;
  
    const { cellY, row } = getRow(
      state,
      viewportY,
      favorScrollableContent === "vertical" || favorScrollableContent === "both"
    );
    const { cellX, column } = getColumn(
      state,
      viewportX,
      favorScrollableContent === "horizontal" || favorScrollableContent === "both"
    );
    return { row, column, viewportX, viewportY, cellX, cellY };
  }
  
  function getRow(
    state: State,
    viewportY: number,
    favorScrollableContent: boolean
  ): { cellY: number; row: GridRow } {
    return (
      getStickyTopRow(state, viewportY, favorScrollableContent) ||
      getStickyBottomRow(state, viewportY, favorScrollableContent) ||
      getRowOnNonSticky(state, viewportY)
    );
  }
  
  function getColumn(
    state: State,
    viewportX: number,
    favorScrollableContent: boolean
  ): { cellX: number; column: GridColumn } {
    return (
      getLeftStickyColumn(state, viewportX, favorScrollableContent) ||
      getRightStickyColumn(state, viewportX, favorScrollableContent) ||
      getColumnOnNonSticky(state, viewportX)
    );
  }
  
  function getRowOnNonSticky(
    state: State,
    viewportY: number
  ): { cellY: number; row: GridRow } {
    if (state.cellMatrix.scrollableRange.rows.length < 1) {
      const sticky =
        viewportY >= state.cellMatrix.height
          ? state.cellMatrix.last
          : state.cellMatrix.first;
      return {
        cellY: sticky.row.height,
        row: sticky.row,
      };
    }
    return getScrollableContentRow(state, viewportY);
  }
  
  function getColumnOnNonSticky(
    state: State,
    viewportX: number
  ): { cellX: number; column: GridColumn } {
    if (state.cellMatrix.scrollableRange.columns.length < 1) {
      const sticky =
        viewportX >= state.cellMatrix.width
          ? state.cellMatrix.last
          : state.cellMatrix.first;
      return {
        cellX: sticky.column.width,
        column: sticky.column,
      };
    }
    return getScrollableContentColumn(state, viewportX);
  }
  
  // PRO
  function getStickyBottomRow(
    state: State,
    viewportY: number,
    favorScrollableContent: boolean
  ): { cellY: number; row: GridRow } | undefined {
    const cellMatrix = state.cellMatrix;
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { top } = getReactGridOffsets(state);
    const { height } = getSizeOfElement(state.scrollableElement);
    const topStickyOffset = getStickyOffset(scrollTop, top);
    const maxScrollTop = Math.max(cellMatrix.height - height + top, 0);
    const bottomStickyOffset =
      getVisibleSizeOfReactGrid(state).height +
      topStickyOffset -
      cellMatrix.ranges.stickyBottomRange.height;
    if (
      cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
      viewportY >= bottomStickyOffset &&
      !(favorScrollableContent && scrollTop + 1 < maxScrollTop)
    ) {
      const row =
        cellMatrix.ranges.stickyBottomRange.rows.find(
          (row) => row.bottom > viewportY - bottomStickyOffset
        ) || cellMatrix.last.row;
      const cellY = viewportY - bottomStickyOffset - row.top;
      return { cellY, row };
    }
  }
  
  export function getRightStickyColumn(
    state: State,
    viewportX: number,
    favorScrollableContent: boolean
  ): { cellX: number; column: GridColumn } | undefined {
    const cellMatrix = state.cellMatrix;
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { left } = getReactGridOffsets(state);
    const { width } = getSizeOfElement(state.scrollableElement);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);
    const maxScrollLeft = Math.max(cellMatrix.width - width + left, 0);
    const rightStickyOffset =
      getVisibleSizeOfReactGrid(state).width +
      leftStickyOffset -
      cellMatrix.ranges.stickyRightRange.width;
    if (
      cellMatrix.ranges.stickyRightRange.columns.length > 0 &&
      viewportX >= rightStickyOffset &&
      !(favorScrollableContent && scrollLeft + 1 < maxScrollLeft)
    ) {
      const column =
        cellMatrix.ranges.stickyRightRange.columns.find(
          (column) => column.right > viewportX - rightStickyOffset
        ) || cellMatrix.last.column;
      const cellX = viewportX - rightStickyOffset - column.left;
      return { cellX, column };
    }
  }

export function getStickyTopRow(state: State, viewportY: number, favorScrollableContent: boolean): { cellY: number, row: GridRow } | undefined {
    const cellMatrix = state.cellMatrix;
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { top } = getReactGridOffsets(state);
    const topStickyOffset = getStickyOffset(scrollTop, top);
    if (cellMatrix.ranges.stickyTopRange.rows.find(row => row.bottom > viewportY - topStickyOffset) && viewportY < cellMatrix.ranges.stickyTopRange.height + topStickyOffset && !(favorScrollableContent && scrollTop > top)) {
        const row = cellMatrix.ranges.stickyTopRange.rows.find(row => row.bottom > viewportY - topStickyOffset) || cellMatrix.ranges.stickyTopRange.first.row;
        const cellY = viewportY - row.top;
        return { cellY, row };
    }
}

export function getLeftStickyColumn(state: State, viewportX: number, favorScrollableContent: boolean): { cellX: number, column: GridColumn } | undefined {
    const cellMatrix = state.cellMatrix;
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { left } = getReactGridOffsets(state);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);
    if (cellMatrix.ranges.stickyLeftRange.columns.find(column => column.right > viewportX - leftStickyOffset) && viewportX < cellMatrix.ranges.stickyLeftRange.width + leftStickyOffset && !(favorScrollableContent && scrollLeft > left)) {
        const column = cellMatrix.ranges.stickyLeftRange.columns.find(column => column.right > viewportX - leftStickyOffset) || cellMatrix.ranges.stickyLeftRange.first.column;
        const cellX = viewportX - column.left;
        return { cellX, column };
    }
}

export function getScrollableContentRow(state: State, viewportY: number): { cellY: number, row: GridRow } {
    const cellMatrix = state.cellMatrix;
    const scrollableContentY = viewportY - cellMatrix.ranges.stickyTopRange.height;
    const row = cellMatrix.scrollableRange.rows.find(row => row.bottom >= scrollableContentY) || cellMatrix.scrollableRange.last.row;
    const cellY = scrollableContentY - row.top;
    return { cellY, row };
}

export function getScrollableContentColumn(state: State, viewportX: number): { cellX: number, column: GridColumn } {
    const cellMatrix = state.cellMatrix;
    const scrollableContentX = viewportX - cellMatrix.ranges.stickyLeftRange.width;
    const column = cellMatrix.scrollableRange.columns.find(column => column.right >= scrollableContentX) || cellMatrix.scrollableRange.last.column;
    const cellX = scrollableContentX - column.left;
    return { cellX, column };
} 
