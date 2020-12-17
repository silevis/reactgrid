import { State } from '../Model/State';
import { ReactGridProps } from '../Model/PublicModel';
import { getSizeOfElement } from './elementSizeHelpers';
import { CellMatrix } from '../Model/CellMatrix';

const DEFAULT_BREAKPOINT = 50;

export function updateResponsiveSticky(props: ReactGridProps, state: State): State {
    const {
        horizontalStickyBreakpoint = DEFAULT_BREAKPOINT,
        verticalStickyBreakpoint = DEFAULT_BREAKPOINT,
    } = props;
    let leftStickyColumns = props.stickyLeftColumns || 0;
    let topStickyRows = props.stickyTopRows || 0;
    if (props.stickyLeftColumns || props.stickyTopRows) {
        const { width: widthOfScrollableElement, height: heightOfScrollableElement } = getSizeOfElement(state.scrollableElement);
        if (props.stickyLeftColumns) {
            const predictedLeftRangeWidth = props.columns.slice(0, props.stickyLeftColumns || 0).reduce((prev, curr) => {
                return prev + (curr.width || CellMatrix.DEFAULT_COLUMN_WIDTH);
            }, 0);
            const shouldDisableStickyHorizontally = predictedLeftRangeWidth > (horizontalStickyBreakpoint * widthOfScrollableElement) / 100;
            leftStickyColumns = shouldDisableStickyHorizontally ? 0 : leftStickyColumns;
        }
        if (props.stickyTopRows) {
            const predictedTopRangeHeight = props.rows.slice(0, props.stickyTopRows || 0).reduce((prev, curr) => {
                return prev + (curr.height || CellMatrix.DEFAULT_ROW_HEIGHT);
            }, 0);
            const shouldDisableStickyVertically = predictedTopRangeHeight > (verticalStickyBreakpoint * heightOfScrollableElement) / 100;
            topStickyRows = shouldDisableStickyVertically ? 0 : topStickyRows;
        }
    }
    return {
        ...state,
        leftStickyColumns,
        topStickyRows,
    };
}