import React from "react";
import {
  Direction,
  GridColumn,
  PointerLocation,
  Range,
  getScrollOfScrollableElement,
  getReactGridOffsets,
  getStickyOffset,
  getVisibleSizeOfReactGrid,
  CellMatrix,
} from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { State } from "../Model/State";
import { Behavior } from "../Model/Behavior";
import { ResizeHint } from "../Components/ResizeHint";

export class ResizeColumnBehavior extends Behavior {
  // TODO min / max column with on column object
  private resizedColumn!: GridColumn;
  private initialLocation!: PointerLocation;
  autoScrollDirection: Direction = "horizontal";
  isInScrollableRange!: boolean;

  handlePointerDown(
    event: PointerEvent,
    location: PointerLocation,
    state: State
  ): State {
    this.initialLocation = location;
    this.resizedColumn = location.column;
    this.isInScrollableRange = state.cellMatrix.scrollableRange.columns.some(
      (c) => c.idx === this.resizedColumn.idx
    );
    return state;
  }
  handlePointerMove(
    event: PointerEvent,
    location: PointerLocation,
    state: State
  ): State {
    let linePosition = location.viewportX;
    if (
      !(
        (location.column.idx === this.resizedColumn.idx &&
          location.cellX > (state.props?.minColumnWidth ?? CellMatrix.MIN_COLUMN_WIDTH)) ||
        location.column.idx > this.resizedColumn.idx
      )
    ) {
      const offset = this.getLinePositionOffset(state);
      linePosition =
        (state.props?.minColumnWidth ?? CellMatrix.MIN_COLUMN_WIDTH) + this.resizedColumn.left + offset;
    }
    return { ...state, linePosition, lineOrientation: "vertical" };
  }

  handlePointerUp(
    event: PointerEvent,
    location: PointerLocation,
    state: State
  ): State {
    const newWidth =
      this.resizedColumn.width +
      location.viewportX -
      this.initialLocation.viewportX;
    if (state.props?.onColumnResized) {
      const newColWidth =
        newWidth >= (state.props?.minColumnWidth ?? CellMatrix.MIN_COLUMN_WIDTH)
          ? newWidth
          : (state.props?.minColumnWidth ?? CellMatrix.MIN_COLUMN_WIDTH);
      state.props.onColumnResized(
        this.resizedColumn.columnId,
        newColWidth,
        state.selectedIds
      );
    }
    let focusedLocation = state.focusedLocation;
    if (
      focusedLocation !== undefined &&
      this.resizedColumn.columnId === focusedLocation.column.idx
    ) {
      const column = { ...focusedLocation.column, width: newWidth };
      focusedLocation = { ...focusedLocation, column };
    }
    return { ...state, linePosition: -1, focusedLocation };
  }


  //should render ResizeHint on pane which has got the highest priority
  renderPanePart(state: State, pane: Range): React.ReactNode {
    const offset = this.getLinePositionOffset(state);
    return (
      pane.contains(this.initialLocation) && (
        <ResizeHint
          left={this.resizedColumn.left}
          linePosition={state.linePosition}
          offset={offset}
        />
      )
    );
  }

  getLinePositionOffset(state: State): number {
    const { scrollLeft } = getScrollOfScrollableElement(
      state.scrollableElement
    );
    const { left } = getReactGridOffsets(state);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);
    const rightStickyOffset =
      getVisibleSizeOfReactGrid(state).width +
      leftStickyOffset -
      state.cellMatrix.ranges.stickyRightRange.width;
    let offset = 0;
    if (
      state.cellMatrix.scrollableRange.columns.some(
        (c) => c.idx === this.resizedColumn.idx
      )
    ) {
      offset = state.cellMatrix.ranges.stickyLeftRange.width;
    } else if (
      state.cellMatrix.ranges.stickyRightRange.columns.some(
        (c) => c.idx === this.resizedColumn.idx
      )
    ) {
      offset = rightStickyOffset;
    } else {
      offset = scrollLeft;
    }
    return offset;
  }
  
  handleDoubleClick(event: PointerEvent, location: PointerLocation, state: State): State {
    // 可能需要实现一个方法来计算当前列的最佳宽度，例如：
    // const newWidth = this.calculateOptimalColumnWidth(this.resizedColumn.columnId, state);
    const newWidth = 200
  
    // 更新列宽
    if (state.props?.onColumnResized) {
      state.props.onColumnResized(
        this.resizedColumn.columnId,
        newWidth,
        state.selectedIds
      );
    }
  
    let focusedLocation = state.focusedLocation;
    if (
      focusedLocation !== undefined &&
      this.resizedColumn.columnId === focusedLocation.column.idx
    ) {
      const column = { ...focusedLocation.column, width: newWidth };
      focusedLocation = { ...focusedLocation, column };
    }
  
    return { ...state, linePosition: -1, focusedLocation };
  }
  
  // calculateOptimalColumnWidth(columnId: number, state: State): number {
  //   // 这里需要实现逻辑以便根据列中的内容计算最佳列宽
  //   // 例如，遍历当前列的所有单元格并找到内容最长的单元格的尺寸
  //   // 为简化起见，这里使用伪代码表示：
  
  //   let maxWidth = 0;
  
  //   // 假设getCellContent是一个获取单元格内容的函数
  //   state.cellMatrix.columns[columnId].cells.forEach(cell => {
  //     const contentWidth = this.measureTextWidth(getCellContent(cell));
  //     if (contentWidth > maxWidth) {
  //       maxWidth = contentWidth;
  //     }
  //   });
  
  //   // 添加一些额外的空间以防文本被截断
  //   return maxWidth + 10; // 假设添加10px的空间
  // }
  
  // measureTextWidth(text: string): number {
  //   // 这里需要实现逻辑以测量文本的宽度
  //   // 这可能需要一个临时的HTML元素或使用Canvas API来准确测量
  //   // 由于文本的宽度跟字体有关，需要确保测量时使用的字体与表格单元格中的字体相同
  //   // 为简化起见，这里使用伪代码表示：
  
  //   const context = document.createElement('canvas').getContext('2d');
  //   // 设置与表格单元格中相同的字体样式
  //   context.font = '14px Arial';
  //   return context.measureText(text).width;
  // }
  
}
