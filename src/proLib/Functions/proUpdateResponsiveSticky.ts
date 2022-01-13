import { CellMatrix, getSizeOfElement, ReactGridProps } from "../../core";
import { ProState } from "../Model/ProState";

const DEFAULT_BREAKPOINT = 50;

export function proUpdateResponsiveSticky(
  props: ReactGridProps,
  state: ProState
): ProState {
  const {
    horizontalStickyBreakpoint = DEFAULT_BREAKPOINT,
    verticalStickyBreakpoint = DEFAULT_BREAKPOINT,
  } = props;
  let leftStickyColumns = props.stickyLeftColumns || 0;
  let topStickyRows = props.stickyTopRows || 0;
  let rightStickyColumns = props.stickyRightColumns || 0;
  let bottomStickyRows = props.stickyBottomRows || 0;
  if (
    props.stickyTopRows ||
    props.stickyLeftColumns ||
    props.stickyRightColumns ||
    props.stickyBottomRows
  ) {
    const {
      width: widthOfScrollableElement,
      height: heightOfScrollableElement,
    } = getSizeOfElement(state.scrollableElement);
    if (props.stickyLeftColumns || props.stickyRightColumns) {
      const predictedLeftRangeWidth = props.columns
        .slice(0, leftStickyColumns)
        .reduce((acc, column) => {
          return acc + (column.width || CellMatrix.DEFAULT_COLUMN_WIDTH);
        }, 0);
      let predictedRightRangeWidth = 0;
      if (rightStickyColumns > 0) {
        predictedRightRangeWidth = props.columns
          .slice(-rightStickyColumns)
          .reduce((acc, column) => {
            return acc + (column.width || CellMatrix.DEFAULT_COLUMN_WIDTH);
          }, 0);
      }
      const shouldDisableStickyHorizontally =
        predictedLeftRangeWidth + predictedRightRangeWidth >
        (horizontalStickyBreakpoint * widthOfScrollableElement) / 100;
      leftStickyColumns = shouldDisableStickyHorizontally
        ? 0
        : leftStickyColumns;
      rightStickyColumns = shouldDisableStickyHorizontally
        ? 0
        : rightStickyColumns;
    }
    if (props.stickyTopRows || props.stickyBottomRows) {
      const predictedTopRangeHeight = props.rows
        .slice(0, topStickyRows)
        .reduce((acc, column) => {
          return acc + (column.height || CellMatrix.DEFAULT_ROW_HEIGHT);
        }, 0);
      let predictedBottomRangeHeight = 0;
      if (bottomStickyRows > 0) {
        predictedBottomRangeHeight = props.rows
          .slice(-bottomStickyRows)
          .reduce((prev, column) => {
            return prev + (column.height || CellMatrix.DEFAULT_ROW_HEIGHT);
          }, 0);
      }
      const shouldDisableStickyVertically =
        predictedTopRangeHeight + predictedBottomRangeHeight >
        (verticalStickyBreakpoint * heightOfScrollableElement) / 100;
      topStickyRows = shouldDisableStickyVertically ? 0 : topStickyRows;
      bottomStickyRows = shouldDisableStickyVertically ? 0 : bottomStickyRows;
    }
  }
  return {
    ...state,
    leftStickyColumns,
    topStickyRows,
    rightStickyColumns,
    bottomStickyRows,
  };
}
