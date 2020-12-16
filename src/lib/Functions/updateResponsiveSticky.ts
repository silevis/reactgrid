import { State } from '../Model/State';
import { ReactGridProps } from '../Model/PublicModel';
import { getSizeOfElement } from './elementSizeHelpers';
import { CellMatrix } from '../../core';

export function updateResponsiveSticky(props: ReactGridProps, state: State): State {
    const breakpoints = props.breakpoints;
    let stickyLeftColumns = props.stickyLeftColumns || 0;
    let stickyTopRows = props.stickyTopRows || 0;
    if (breakpoints && (props.stickyTopRows || props.stickyLeftColumns)) {
        const { width: widthOfScrollableElement, height: heightOfScrollableElement } = getSizeOfElement(state.scrollableElement);
        if (breakpoints.breakpointHorizontal && props.stickyLeftColumns) {
            const predictedLeftRangeWidth = props.columns.slice(0, props.stickyLeftColumns || 0).reduce((prev, curr) => {
                return prev + (curr.width || CellMatrix.DEFAULT_COLUMN_WIDTH);
            }, 0);
            const shouldDisableStickyHorizontally = predictedLeftRangeWidth > (breakpoints.breakpointHorizontal * widthOfScrollableElement) / 100;
            stickyLeftColumns = shouldDisableStickyHorizontally ? 0 : stickyLeftColumns;
        }
        if (breakpoints.breakpointVertical && props.stickyTopRows) {
            const predictedTopRangeHeight = props.rows.slice(0, props.stickyTopRows || 0).reduce((prev, curr) => {
                return prev + (curr.height || CellMatrix.DEFAULT_ROW_HEIGHT);
            }, 0);
            const shouldDisableStickyVertically = predictedTopRangeHeight > (breakpoints.breakpointVertical * heightOfScrollableElement) / 100;
            stickyTopRows = shouldDisableStickyVertically ? 0 : stickyTopRows;
        }
    }
    return {
        ...state,
        stickyLeftColumns,
        stickyTopRows,
    };
}