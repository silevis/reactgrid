import {
  PositionState,
  Location,
  getScrollOfScrollableElement,
  getReactGridOffsets,
  getTopScrollableElement,
  getStickyLeftRangeWidth,
  getLeftStickyOffset,
  getStickyTopRangeWidth,
  getTopStickyOffset,
  getStickyOffset,
  getVisibleSizeOfReactGrid,
  CellEditorOffset,
} from "../../core";
import { State } from "../Model/State";
import { CellMatrix } from "../Model/CellMatrix";

const calculatedXAxisOffset = (location: Location, state: State) => {
  const cellMatrix = state.cellMatrix;
  const offset: number | undefined = getRightStickyOffset(cellMatrix, location, state)
      || getStickyLeftRangeWidth(cellMatrix, location) || getLeftStickyOffset(cellMatrix, location, state);
  if (offset) {
      return offset;
  }
  return 0;
}

function getRightStickyOffset(cellMatrix: CellMatrix, location: Location, state: State): number | undefined {
  if (cellMatrix.ranges.stickyRightRange.first.column && location.column.idx >= cellMatrix.ranges.stickyRightRange.first.column.idx) {
      const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
      const { left } = getReactGridOffsets(state);
      const leftStickyOffset = getStickyOffset(scrollLeft, left);
      const rightStickyOffset = getVisibleSizeOfReactGrid(state).width + leftStickyOffset - cellMatrix.ranges.stickyRightRange.width;
      return rightStickyOffset;
  }
}

function getBottomStickyOffset(cellMatrix: CellMatrix, location: Location, state: State): number | undefined {
  if (cellMatrix.ranges.stickyBottomRange.first.row && location.row.idx >= cellMatrix.ranges.stickyBottomRange.first.row.idx) {
      const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
      const { top } = getReactGridOffsets(state);
      const topStickyOffset = getStickyOffset(scrollTop, top);
      const bottomStickyOffset = getVisibleSizeOfReactGrid(state).height + topStickyOffset - cellMatrix.ranges.stickyBottomRange.height;
      return bottomStickyOffset;
  }
}

const calculatedYAxisOffset = (location: Location, state: State): number => {
  const cellMatrix = state.cellMatrix;
  const offset: number | undefined = getBottomStickyOffset(cellMatrix, location, state)
      || getStickyTopRangeWidth(cellMatrix, location) || getTopStickyOffset(cellMatrix, location, state);
  if (offset) {
      return offset;
  }
  return 0;
}

export const calculateCellEditorPosition = (positionState: PositionState): CellEditorOffset => {
  const { state, location } = positionState;
  const { scrollTop, scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
  const { top, left } = getReactGridOffsets(state);
  let offsetLeft = 0,
      offsetTop = 0;
  if (state.scrollableElement !== getTopScrollableElement()) {
      const { left, top } = (state.scrollableElement as HTMLElement).getBoundingClientRect();
      offsetLeft = left;
      offsetTop = top;
  }

  // React StrictMode calls reducer two times to eliminate any side-effects
  // this function is a reducer so we need to add the state and location to positionState
  // in order to get them in the second call
  return {
    state,
    location,
    left: location.column.left + calculatedXAxisOffset(location, state as State)
        + offsetLeft
        + left
        - scrollLeft,
    top: location.row.top + calculatedYAxisOffset(location, state as State)
        + offsetTop
        + top
        - scrollTop
  };
}