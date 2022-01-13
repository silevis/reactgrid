import { ProBehavior } from "../Model/ProBehavior";
import { ProState } from "../Model/ProState";
import {
  PointerLocation,
  getScrollOfScrollableElement,
  Id,
  DropPosition,
  Direction,
} from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { handleContextMenu } from "../Functions/handleContextMenu";

// TODO do a total rewrite here
export class RowReorderBehavior extends ProBehavior {
  // TODO dont use internal state. Always fresh recalculation based on input data!
  private initialRowIdx!: number;
  private lastPossibleDropLocation?: PointerLocation;
  private pointerOffset!: number;
  private selectedIds!: Id[];
  private position!: DropPosition;
  autoScrollDirection: Direction = "vertical";

  handlePointerDown(
    event: PointerEvent,
    location: PointerLocation,
    state: ProState
  ): ProState {
    this.initialRowIdx = location.row.idx;
    this.lastPossibleDropLocation = location;
    const indexes = state.selectedIndexes.sort();
    const rows = indexes.map((i) => state.cellMatrix.rows[i]);
    const upperIndexes = indexes.filter((i) => i < location.row.idx);
    const upperRows = upperIndexes.map((i) => state.cellMatrix.rows[i]);
    const upperRowsHeight = upperRows.reduce((sum, row) => sum + row.height, 0);
    this.pointerOffset = upperRowsHeight + location.cellY;
    this.selectedIds = rows.map((r) => r.rowId);
    return {
      ...state,
      lineOrientation: "horizontal",
      shadowSize: rows.reduce((sum, col) => sum + col.height, 0),
      shadowPosition: this.getShadowPosition(location, state),
    };
  }

  handlePointerMove(
    event: PointerEvent,
    location: PointerLocation,
    state: ProState
  ): ProState {
    const shadowPosition = this.getShadowPosition(location, state);
    let shadowCursor = "-webkit-grabbing";
    let linePosition = state.linePosition;
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const pointerLocation = location.viewportY + 0;
    this.lastPossibleDropLocation = this.getLastPossibleDropLocation(
      state,
      location
    );
    if (
      this.lastPossibleDropLocation &&
      this.lastPossibleDropLocation.row.idx !== this.initialRowIdx
    ) {
      const drawDown =
        this.lastPossibleDropLocation.row.idx > this.initialRowIdx;
      linePosition = Math.min(
        this.lastPossibleDropLocation.viewportY -
          this.lastPossibleDropLocation.cellY +
          (drawDown ? this.lastPossibleDropLocation.row.height : 0),
        (state.visibleRange?.height || 0) +
          state.cellMatrix.ranges.stickyTopRange.height +
          state.cellMatrix.ranges.stickyBottomRange.height +
          scrollTop
      );
      if (!state.props?.canReorderRows) {
        this.position = drawDown ? "after" : "before";
      } else {
        if (
          state.props.canReorderRows &&
          state.props.canReorderRows(
            this.lastPossibleDropLocation.row.rowId,
            this.selectedIds,
            this.position
          )
        ) {
          if (drawDown) {
            if (
              pointerLocation >
                location.row.top +
                  state.cellMatrix.ranges.stickyTopRange.height &&
              pointerLocation <
                location.row.top +
                  state.cellMatrix.ranges.stickyTopRange.height +
                  location.row.height / 2
            ) {
              this.position = "on";
              shadowCursor = "move";
              linePosition = -1;
            } else {
              this.position = "after";
            }
          } else {
            if (
              pointerLocation >
                location.row.top +
                  state.cellMatrix.ranges.stickyTopRange.height +
                  location.row.height / 2 &&
              pointerLocation <
                location.row.top +
                  state.cellMatrix.ranges.stickyTopRange.height +
                  location.row.height
            ) {
              this.position = "on";
              shadowCursor = "move";
              linePosition = -1;
            } else {
              this.position = "before";
            }
          }
        } else {
          linePosition = -1;
        }
      }
    }

    return {
      ...state,
      shadowPosition,
      linePosition,
      shadowCursor,
    };
  }

  getShadowPosition(location: PointerLocation, state: ProState): number {
    const y = location.viewportY - this.pointerOffset;
    const max = state.cellMatrix.height - state.shadowSize;
    if (y < 0) {
      return 0;
    } else if (y > max) {
      return max;
    }
    return y;
  }

  getLastPossibleDropLocation(
    state: ProState,
    currentLocation: PointerLocation
  ): PointerLocation | undefined {
    if (
      !state.props?.canReorderRows ||
      state.props.canReorderRows(
        currentLocation.row.rowId,
        this.selectedIds,
        this.position
      )
    ) {
      return currentLocation;
    }
    return this.lastPossibleDropLocation;
  }

  handlePointerUp(
    event: PointerEvent,
    location: PointerLocation,
    state: ProState
  ): ProState {
    if (
      location.row.idx !== this.initialRowIdx &&
      this.lastPossibleDropLocation &&
      state.props?.onRowsReordered
    ) {
      state.props?.onRowsReordered(
        this.lastPossibleDropLocation.row.rowId,
        this.selectedIds,
        this.position
      );
    }
    return {
      ...state,
      linePosition: -1,
      shadowPosition: -1,
      shadowCursor: "default",
    };
  }

  handleContextMenu(event: PointerEvent, state: ProState): ProState {
    return handleContextMenu(event, state);
  }
}
