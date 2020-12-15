import { State } from '../Model/State';
import { ReactGridProps } from '../Model/PublicModel';
import { getSizeOfElement } from './elementSizeHelpers';
import { CellMatrix } from '../../core';

export function updateResponsiveSticky(props: ReactGridProps, state: State): State {
    const breakpoint = props.breakpoint;
    if (breakpoint) {
        const { width: widthOfScrollableElement } = getSizeOfElement(state);
        const predictedLeftRangeWidth = props.columns.slice(0, props.stickyLeftColumns || 0).reduce((prev, curr) => {
            return prev + (curr.width || CellMatrix.DEFAULT_COLUMN_WIDTH);
        }, 0);
        const shouldDisableStickyOnScrollableElement = predictedLeftRangeWidth > (breakpoint * widthOfScrollableElement) / 100;
        return {
            ...state,
            leftSticky: shouldDisableStickyOnScrollableElement ? 0 : props.stickyLeftColumns || 0,
            topSticky: props.stickyTopRows || 0,
        };
    }
    return {
        ...state,
        leftSticky: props.stickyLeftColumns || 0,
        topSticky: props.stickyTopRows || 0,
    };
}