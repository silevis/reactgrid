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
import { CellMatrix, StickyRanges } from "../Model/CellMatrix";

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

export type EditorPosition = {
  width: number;
  height: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  position: 'fixed' | 'absolute' | 'sticky';
  zIndex: number;
}

export const calculateCellEditorPosition = (stickyRanges: StickyRanges, location: Location, state: State): EditorPosition => {
  const { scrollTop, scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
  const { top, left } = getReactGridOffsets(state);
  let offsetLeft = 0,
      offsetTop = 0;
  if (state.scrollableElement !== getTopScrollableElement()) {
      const { left, top } = (state.scrollableElement as HTMLElement).getBoundingClientRect();
      offsetLeft = left;
      offsetTop = top;
  }

  const fixedPosition: EditorPosition = {
    width: location.column.width + 1,
    height: location.row.height + 1,
    top:
      location.row.top +
      calculatedYAxisOffset(location, state) +
      offsetTop +
      top -
      scrollTop,
    left:
      location.column.left +
      calculatedXAxisOffset(location, state) +
      offsetLeft +
      left -
      scrollLeft,
    position: 'fixed',
    zIndex: 5,
  };

  if (!state.props?.disableFixedCellEditor) return fixedPosition;
  // Else: calculate position for non-fixed cell editor

  const isStickyTop = stickyRanges.stickyTopRange.contains(location);
  const isStickyRight = stickyRanges.stickyRightRange.contains(location);
  const isStickyBottom = stickyRanges.stickyBottomRange.contains(location);
  const isStickyLeft = stickyRanges.stickyLeftRange.contains(location);

  // TODO: Editor on corner panes fallbacks to fixed positioning, because I couldn't figure out how to sensibly update its position on scroll
  switch (true) {
    // Top Left
    case isStickyTop && isStickyLeft:
      return fixedPosition;
    // Top Center
    case isStickyTop && !(isStickyLeft || isStickyRight):
      return {
        width: location.column.width + 1,
        height: location.row.height + 1,
        top: location.row.top,
        left: location.column.left + state.cellMatrix.ranges.stickyLeftRange.width,
        position: 'absolute',
        zIndex: 3
      }
    // Top Right
    case isStickyTop && isStickyRight:
      return fixedPosition;

    // Center Left
    case !isStickyTop && isStickyLeft && !isStickyBottom:
      return {
        ...fixedPosition,
        top: location.row.top + state.cellMatrix.ranges.stickyTopRange.height,
        left: location.column.left,
        position: 'absolute',
        zIndex: 3
      };
    // Center Center
    case !isStickyTop && !isStickyLeft && !isStickyRight && !isStickyBottom:
      return {
        ...fixedPosition,
        top: location.row.top + state.cellMatrix.ranges.stickyTopRange.height,
        left: location.column.left + state.cellMatrix.ranges.stickyLeftRange.width,
        position: 'absolute',
        zIndex: 1
      }
    // Center Right
    case !isStickyTop && isStickyRight && !isStickyBottom:
      return {
        ...fixedPosition,
        top: location.row.top + state.cellMatrix.ranges.stickyTopRange.height,
        left: location.column.left + state.cellMatrix.scrollableRange.width + state.cellMatrix.ranges.stickyLeftRange.width,
        position: 'absolute',
        zIndex: 3
      }

    // Bottom Left
    case isStickyBottom && isStickyLeft:
      return fixedPosition;
    // Bottom Center
    case isStickyBottom && !(isStickyLeft || isStickyRight):
      return {
        ...fixedPosition,
        // top: location.row.top + state.cellMatrix.scrollableRange.height + state.cellMatrix.ranges.stickyTopRange.height,
        bottom: location.row.bottom,
        left: location.column.left + state.cellMatrix.ranges.stickyLeftRange.width,
        position: 'absolute',
        zIndex: 3
      };
    // Bottom Right
    case isStickyBottom && isStickyRight:
      return fixedPosition;

    default:
      return fixedPosition;
  }
}

//   if (isFixedDisabled) {
//     let leftOffset = location.column.left;
//     let topOffset = location.row.top;

//     const isStickyTop = state.cellMatrix.ranges.stickyTopRange.contains(location);
//     const isStickyRight = state.cellMatrix.ranges.stickyRightRange.contains(location);
//     const isStickyBottom = state.cellMatrix.ranges.stickyBottomRange.contains(location);
//     const isStickyLeft = state.cellMatrix.ranges.stickyLeftRange.contains(location);

//     switch (true) {
//       // Top Left
//       case isStickyTop && isStickyLeft:
//         // topOffset += scrollTop;
        
//         break;
//       // Top Center
//       case isStickyTop && !(isStickyLeft || isStickyRight):
//         leftOffset += state.cellMatrix.ranges.stickyLeftRange.width;
//         break;
//       // Top Right
//       case isStickyTop && isStickyRight:
//         leftOffset += state.cellMatrix.scrollableRange.width + state.cellMatrix.ranges.stickyLeftRange.width + scrollTop;
//         break;

//       // Center Left
//       case !isStickyTop && isStickyLeft && !isStickyBottom:
//         topOffset += state.cellMatrix.ranges.stickyTopRange.height;
//         break;
//       // Center Center
//       case !isStickyTop && !isStickyLeft && !isStickyRight && !isStickyBottom:
//         topOffset += state.cellMatrix.ranges.stickyTopRange.height;
//         leftOffset += state.cellMatrix.ranges.stickyLeftRange.width;
//         break;
//       // Center Right
//       case !isStickyTop && isStickyRight && !isStickyBottom:
//         topOffset += state.cellMatrix.ranges.stickyTopRange.height;
//         leftOffset += state.cellMatrix.scrollableRange.width + state.cellMatrix.ranges.stickyLeftRange.width;
//         break;
      
//       // Bottom Left
//       case isStickyBottom && isStickyLeft:
//         topOffset += state.cellMatrix.scrollableRange.height + state.cellMatrix.ranges.stickyTopRange.height + scrollTop;
//         break;
//       // Bottom Center
//       case isStickyBottom && !(isStickyLeft || isStickyRight):
//         topOffset += state.cellMatrix.scrollableRange.height + state.cellMatrix.ranges.stickyTopRange.height;
//         leftOffset += state.cellMatrix.ranges.stickyLeftRange.width;
//         break;
//       // Bottom Right
//       case isStickyBottom && isStickyRight:
//         topOffset += state.cellMatrix.scrollableRange.height + state.cellMatrix.ranges.stickyTopRange.height;
//         leftOffset += state.cellMatrix.scrollableRange.width + state.cellMatrix.ranges.stickyLeftRange.width;
//         break;
//     }

//     return { 
//       left: leftOffset,
//       top: topOffset
//     };
//   }

//   return {
//     left: location.column.left + calculatedXAxisOffset(location, state) + offsetLeft + left - scrollLeft,
//     top: location.row.top + calculatedYAxisOffset(location, state) + offsetTop + top - scrollTop,
//   };
// };