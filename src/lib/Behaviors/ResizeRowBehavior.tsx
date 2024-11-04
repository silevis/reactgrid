import React from "react";
import {
  Direction,
  GridRow,
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
import { ResizeVerticalHint } from "../Components/ResizeHint";

export class ResizeRowBehavior extends Behavior {
  // TODO min / max row height on row object
  private resizedRow!: GridRow;
  private initialLocation!: PointerLocation;
  autoScrollDirection: Direction = "vertical";
  isInScrollableRange!: boolean;

  handlePointerDown(
    event: PointerEvent,
    location: PointerLocation,
    state: State
  ): State {
    this.initialLocation = location;
    this.resizedRow = location.row;
    this.isInScrollableRange = state.cellMatrix.scrollableRange.rows.some(
      (r) => r.idx === this.resizedRow.idx
    );
    return state;
  }

  handlePointerMove(
    event: PointerEvent,
    location: PointerLocation,
    state: State
  ): State {
    let linePosition = location.viewportY;
    if (
      !(
        (location.row.idx === this.resizedRow.idx &&
          location.cellY > (state.props?.minRowHeight ?? CellMatrix.MIN_ROW_HEIGHT)) ||
        location.row.idx > this.resizedRow.idx
      )
    ) {
      const offset = this.getLinePositionOffset(state);
      linePosition =
        (state.props?.minRowHeight ?? CellMatrix.MIN_ROW_HEIGHT) + this.resizedRow.top + offset;
    }
    return { ...state, linePosition, lineOrientation: "horizontal" };
  }

  handlePointerUp(
    event: PointerEvent,
    location: PointerLocation,
    state: State
  ): State {
    const newHeight =
      this.resizedRow.height +
      location.viewportY -
      this.initialLocation.viewportY;
    if (state.props?.onRowResized) {
      const newRowHeight =
        newHeight >= (state.props?.minRowHeight ?? CellMatrix.MIN_ROW_HEIGHT)
          ? newHeight
          : (state.props?.minRowHeight ?? CellMatrix.MIN_ROW_HEIGHT);
      state.props.onRowResized(
        this.resizedRow.rowId,
        newRowHeight,
        state.selectedIds
      );
    }
    let focusedLocation = state.focusedLocation;
    if (
      focusedLocation !== undefined &&
      this.resizedRow.rowId === focusedLocation.row.idx
    ) {
      const row = { ...focusedLocation.row, height: newHeight };
      focusedLocation = { ...focusedLocation, row };
    }
    return { ...state, linePosition: -1, focusedLocation };
  }

  // Should render ResizeVerticalHint on pane which has the highest priority
  renderPanePart(state: State, pane: Range): React.ReactNode {
    const offset = this.getLinePositionOffset(state);
    return (
      pane.contains(this.initialLocation) && (
        <ResizeVerticalHint
          top={this.resizedRow.top}
          linePosition={state.linePosition}
          offset={offset}
        />
      )
    );
  }

  getLinePositionOffset(state: State): number {
    const { scrollTop } = getScrollOfScrollableElement(
      state.scrollableElement
    );
    const { top } = getReactGridOffsets(state);
    const topStickyOffset = getStickyOffset(scrollTop, top);
    const bottomStickyOffset =
      getVisibleSizeOfReactGrid(state).height +
      topStickyOffset -
      state.cellMatrix.ranges.stickyBottomRange.height;
    let offset = 0;
    if (
      state.cellMatrix.scrollableRange.rows.some(
        (r) => r.idx === this.resizedRow.idx
      )
    ) {
      offset = state.cellMatrix.ranges.stickyTopRange.height;
    } else if (
      state.cellMatrix.ranges.stickyBottomRange.rows.some(
        (r) => r.idx === this.resizedRow.idx
      )
    ) {
      offset = bottomStickyOffset;
    } else {
      offset = scrollTop;
    }
    return offset;
  }
}
